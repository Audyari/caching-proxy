#!/usr/bin/env node

const { Command } = require('commander')
const startServer = require('../src/server')
const clearCache = require('../src/cache').clearCache

const program = new Command()

program
    .option('--port <number>', 'Port to run the caching proxy server')
    .option('--origin <url>', 'Origin server URL')
    .option('--clear-cache', 'Clear stored cache')

program.parse(process.argv)

const options = program.opts()

if (options.clearCache) {
    clearCache()
    console.log('Cache cleared successfully!')
    process.exit(0)
}

if (!options.port || !options.origin) {
    console.error('Please provide --port and --origin')
    process.exit(1)
}

startServer(options.port, options.origin)
