const { Queue } = require('bullmq')
const Redis = require('ioredis')

const connection = new Redis(process.env.REDIS_URL)

const notificationQueue = new Queue('notificationQueue', {
    connection,
})

module.exports = { notificationQueue }
