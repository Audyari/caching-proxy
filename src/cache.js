let cache = {}

function getCache(key) {
    return cache[key]
}

function setCache(key, value) {
    cache[key] = value
}

function clearCache() {
    cache = {}
}

module.exports = {
    getCache,
    setCache,
    clearCache,
}
