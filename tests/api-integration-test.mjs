/**
 * ChiNex End-to-End API Integration Test Suite
 * Tests full flow across all modules against the live backend server.
 */

const BASE_URL = process.env.API_URL || "http://localhost:8080";

async function runTestSuite() {
  const results = [];
  let cookie = "";
  let createdVocabId = null;

  async function test(name, fn) {
    try {
      await fn();
      results.push({ name, pass: true });
      console.log(`  ✅ [PASS] ${name}`);
    } catch (err) {
      results.push({ name, pass: false, error: err.message });
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  console.log(`\n================================================================================`);
  console.log(`🌐 CHI-NEX API INTEGRATION TESTS -> ${BASE_URL}`);
  console.log(`================================================================================\n`);

  // 1. Health check
  await test("GET /api/ping (Health Check)", async () => {
    const res = await fetch(`${BASE_URL}/api/ping`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error(`Expected {status: "ok"}, got ${JSON.stringify(data)}`);
  });

  // 2. Register or Login
  const testEmail = `user_${Date.now()}@test.com`;
  await test("POST /api/auth/register & Login", async () => {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Automated Tester", email: testEmail, password: "TestPassword123" }),
    });

    if (regRes.ok) {
      const setCookie = regRes.headers.get("set-cookie");
      if (setCookie) {
        cookie = setCookie.split(";")[0];
      }
    }

    if (!cookie) {
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: "TestPassword123" }),
      });
      if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
      const setCookie = loginRes.headers.get("set-cookie");
      if (!setCookie) throw new Error("No set-cookie header returned on login");
      cookie = setCookie.split(";")[0];
    }
  });

  // 3. Me endpoint
  await test("GET /api/auth/me (Current User Profile)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const user = await res.json();
    if (!user.email || user.email !== testEmail) throw new Error(`Unexpected user: ${JSON.stringify(user)}`);
  });

  // 4. Create Vocabulary
  await test("POST /api/v1/vocabularies (Create Vocabulary)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/vocabularies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào", example: "你好世界！", note: "Chào hỏi" }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const vocab = await res.json();
    if (!vocab.id || vocab.hanzi !== "你好") throw new Error(`Unexpected vocabulary: ${JSON.stringify(vocab)}`);
    createdVocabId = vocab.id;
  });

  // 5. List Vocabularies
  await test("GET /api/v1/vocabularies (List & Filter)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/vocabularies?limit=10&page=1`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data) || data.pagination.total_items < 1) {
      throw new Error(`Unexpected list response: ${JSON.stringify(data)}`);
    }
  });

  // 6. Dashboard Overview
  await test("GET /api/v1/dashboard/overview (Stats)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/dashboard/overview`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const stats = await res.json();
    if (typeof stats.total_words !== "number" || stats.total_words < 1) {
      throw new Error(`Unexpected overview: ${JSON.stringify(stats)}`);
    }
  });

  // 7. Daily Progress
  await test("GET /api/v1/dashboard/daily-progress (Daily Goals)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/dashboard/daily-progress`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const prog = await res.json();
    if (typeof prog.daily_goal !== "number") throw new Error(`Unexpected daily progress: ${JSON.stringify(prog)}`);
  });

  // 8. Practice Cards
  await test("GET /api/v1/reviews/practice (Flashcard Session)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/reviews/practice?limit=20`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const session = await res.json();
    if (!Array.isArray(session.cards)) throw new Error(`Unexpected practice cards: ${JSON.stringify(session)}`);
  });

  // 9. Submit Review (SRS Rating: Good = 2)
  if (createdVocabId) {
    await test("POST /api/v1/reviews (Submit SRS Review Rating 2)", async () => {
      const res = await fetch(`${BASE_URL}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify({ vocabulary_id: createdVocabId, rating: 2 }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const review = await res.json();
      if (review.rating !== 2 || review.status !== "learning") {
        throw new Error(`Unexpected review response: ${JSON.stringify(review)}`);
      }
    });
  }

  // 10. Update User Settings
  await test("PATCH /api/v1/users/settings (Update Daily Goal)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ daily_goal: 30 }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const settings = await res.json();
    if (settings.daily_goal !== 30) throw new Error(`Expected daily_goal 30, got ${settings.daily_goal}`);
  });

  // 11. Export Vocabularies
  await test("GET /api/v1/vocabularies/export (Export JSON)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/vocabularies/export`, { headers: { cookie } });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items) || items.length < 1) throw new Error(`Expected non-empty array export`);
  });

  return results;
}

export { runTestSuite };

if (process.argv[1] && process.argv[1].endsWith("api-integration-test.mjs")) {
  runTestSuite().then((results) => {
    const failed = results.filter((r) => !r.pass);
    if (failed.length > 0) {
      process.exit(1);
    }
  });
}
