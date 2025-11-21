# 📦 Caching Proxy Server (Node.js)

A CLI-based caching proxy server that forwards requests to an origin server and **caches responses**.
If the same request is made again, the proxy serves the cached response instantly.

---

## Features

-   CLI tool to start a proxy server
-   Caches all GET requests
-   `X-Cache: HIT` / `MISS` headers
-   Clear cache using a CLI command
-   Detailed logging (HIT/MISS, timestamps, origin calls)

---

## 🛠️ Installation

```sh
npm install
npm link
```

---

## ▶️ Start the Proxy Server

```sh
caching-proxy --port 3000 --origin http://dummyjson.com
```

Example:

```
http://localhost:3000/products → forwards to http://dummyjson.com/products
```

---

## 🔍 Cache Response Headers

| Behavior                   | Header          |
| -------------------------- | --------------- |
| Response came from cache   | `X-Cache: HIT`  |
| Fetched from origin server | `X-Cache: MISS` |

---

## Project Structure

```
caching-proxy/
│── bin/index.js      # CLI Handler
│── src/server.js     # Proxy server logic
│── src/cache.js      # In-memory caching
└── package.json
```

---

## 🌐 Project Page

**[https://roadmap.sh/projects/caching-server](https://roadmap.sh/projects/caching-server)**
