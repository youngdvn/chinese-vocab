const PAGE_CACHE = "chinese-vocab-pages-v2"
const API_CACHE = "chinese-vocab-api-v1"

const APP_SHELL = ["/", "/offline"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL)
    })
  )

  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== PAGE_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )

  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const request = event.request

  // Chỉ xử lý GET
  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)

  // Không xử lý Next.js internal files
  if (url.pathname.startsWith("/_next/")) {
    return
  }

  // =========================
  // API - Network First
  // =========================

  if (url.pathname.startsWith("/api/vocabulary")) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(API_CACHE)
            await cache.put(request, response.clone())
          }

          return response
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request)

          if (cachedResponse) {
            return cachedResponse
          }

          return new Response(
            JSON.stringify({
              message: "No internet connection",
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        })
    )

    return
  }

  // =========================
  // Pages - Network First
  // =========================

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedResponse = await caches.match(request)

        if (cachedResponse) {
          return cachedResponse
        }

        return caches.match("/offline")
      })
    )
  }
})
