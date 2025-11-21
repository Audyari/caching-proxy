const express = require('express')
const { getCache, setCache } = require('./cache')

function startServer(port, origin) {
    const app = express()

    app.use(async (req, res) => {
        const cacheKey = req.originalUrl

        const cachedResponse = getCache(cacheKey)

        if (cachedResponse) {
            res.setHeader('X-Cache', 'HIT')
            return res.status(200).send(cachedResponse)
        }

        try {
            const response = await fetch(origin + req.originalUrl)
            const data = await response.text()

            setCache(cacheKey, data)
            res.setHeader('X-Cache', 'MISS')
            return res.status(response.status).send(data)
        } catch (error) {
            return res.status(500).send('Error fetching from origin')
        }
    })

    app.listen(port, () => {
        console.log(`Caching Proxy Server running on port ${port}`)
        console.log(`Forwarding requests to: ${origin}`)
    })
}

module.exports = startServer
