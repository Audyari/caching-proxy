const express = require('express')
const { getCache, setCache } = require('./cache')

function startServer(port, origin) {
    const app = express()

    app.use(async (req, res) => {
        const cacheKey = req.originalUrl
        const timestamp = new Date().toISOString()

        console.log(`\n==============================`)
        console.log(
            `[${timestamp}] Incoming Request: ${req.method} ${req.originalUrl}`
        )

        const cachedResponse = getCache(cacheKey)

        if (cachedResponse) {
            console.log(
                `[CACHE HIT] Returning cached response for: ${req.originalUrl}`
            )

            res.setHeader('X-Cache', 'HIT')
            return res.status(200).send(cachedResponse)
        }

        console.log(
            `[CACHE MISS] Fetching from origin: ${origin + req.originalUrl}`
        )

        try {
            const response = await fetch(origin + req.originalUrl)
            const data = await response.text()

            console.log(`[ORIGIN STATUS] ${response.status}`)
            console.log(
                `[CACHE STORE] Saving response to cache for: ${req.originalUrl}`
            )

            setCache(cacheKey, data)
            res.setHeader('X-Cache', 'MISS')
            return res.status(response.status).send(data)
        } catch (error) {
            console.error(`[ERROR] Failed fetching from origin:`, error.message)
            return res.status(500).send('Error fetching from origin')
        }
    })

    app.listen(port, () => {
        console.log(`Caching Proxy Server running on port ${port}`)
        console.log(`Forwarding requests to: ${origin}`)
    })
}

module.exports = startServer
