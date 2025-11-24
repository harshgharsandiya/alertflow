const { Queue } = require('bullmq')
const Redis = require('ioredis')

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
})

const q = new Queue('notificationQueue', { connection })

q.add('test', { notificationId: 'd3b23fa6-1998-4de2-95b4-c333ad24f5d8' })
    .then(console.log)
    .catch(console.error)
