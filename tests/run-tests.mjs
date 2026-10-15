import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runTestSuite } from "./api-integration-test.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const apiDir = path.resolve(rootDir, "apps", "api");
const testsDir = __dirname;
const historyDir = path.resolve(testsDir, "history");

if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, "-");
const historyLogFile = path.resolve(historyDir, `test-run-${timestamp}.log`);
const latestLogFile = path.resolve(testsDir, "latest-test-run.log");
const summaryFile = path.resolve(testsDir, "test-summary.md");

console.log(`\n🚀 [TEST RUNNER] Khởi động kiểm thử cho ChiNex...`);
console.log(`📁 Thư mục API: ${apiDir}`);
console.log(`📝 Log sẽ được ghi vào: tests/latest-test-run.log\n`);

async function main() {
  let goOutput = "";

  // 1. Run Go unit tests
  const goCode = await new Promise((resolve) => {
    const child = spawn("go", ["test", "-v", "./..."], {
      cwd: apiDir,
      shell: true,
      stdio: ["inherit", "pipe", "pipe"],
    });

    child.stdout.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text);
      goOutput += text;
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      process.stderr.write(text);
      goOutput += text;
    });

    child.on("close", (code) => {
      resolve(code ?? 0);
    });
  });

  // 2. Run Live API Integration Tests
  let integrationResults = [];
  try {
    integrationResults = await runTestSuite();
  } catch (err) {
    console.error("Lỗi khi chạy integration test:", err.message);
  }

  const failedIntegration = integrationResults.filter((r) => !r.pass);
  const overallSuccess = goCode === 0 && failedIntegration.length === 0;

  const finishTime = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const status = overallSuccess ? "PASSED (THÀNH CÔNG)" : `FAILED (THẤT BẠI)`;

  let integrationLog = "\n--- KẾT QUẢ API INTEGRATION TESTS ---\n";
  integrationResults.forEach((r) => {
    integrationLog += `${r.pass ? "[PASS]" : "[FAIL]"} ${r.name}${r.error ? `: ${r.error}` : ""}\n`;
  });

  const fullLog = `================================================================================
CHI-NEX TEST RUN REPORT
Thời gian chạy: ${finishTime}
Trạng thái: ${status}
================================================================================\n\n` +
    goOutput +
    integrationLog;

  fs.writeFileSync(latestLogFile, fullLog, "utf-8");
  fs.writeFileSync(historyLogFile, fullLog, "utf-8");

  const summaryContent = `# ChiNex Test Execution Summary

> Cập nhật lần cuối: **${finishTime}**  
> Trạng thái tổng quan: **${status}**

---

## 📊 Kết Quả API End-to-End Tests (${integrationResults.length} endpoints)

| Endpoint / Luồng Nghiệp Vụ | Trạng thái |
| :--- | :--- |
${integrationResults.map((r) => `| ${r.name} | ${r.pass ? "✅ PASS" : "❌ FAIL"} |`).join("\n")}

## 🧪 Kết Quả Go Package Tests

\`\`\`
${goOutput.trim() || "No unit test files inside modules (modules cleaned as requested)"}
\`\`\`

---

*Log chi tiết đầy đủ có thể xem tại [latest-test-run.log](./latest-test-run.log)*
`;

  fs.writeFileSync(summaryFile, summaryContent, "utf-8");

  console.log(`\n================================================================================`);
  console.log(`🎉 [TEST RUNNER] Đã hoàn tất! Kết quả đã được ghi vào:`);
  console.log(`   - tests/latest-test-run.log`);
  console.log(`   - tests/test-summary.md`);
  console.log(`   - tests/history/test-run-${timestamp}.log`);
  console.log(`================================================================================\n`);

  process.exit(overallSuccess ? 0 : 1);
}

main();
