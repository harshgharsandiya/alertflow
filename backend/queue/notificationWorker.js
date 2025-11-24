console.log('working...')
const { Worker } = require('bullmq')
const Redis = require('ioredis')

const prisma = require('../config/prisma')
const { sendNotificationChannel } = require('../channels')

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
})

const worker = new Worker(
    'notificationQueue',
    async (job) => {
        const { notificationId } = job.data

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        })

        if (!notification) {
            console.error('Notification not found')
            return
        }

        // mark as processing
        await prisma.notification.update({
            where: { id: notificationId },
            data: { status: 'processing' },
        })

        const result = await sendNotificationChannel(notification)

        if (result.success) {
            await prisma.notification.update({
                where: { id: notificationId },
                data: {
                    status: 'sent',
                    payload: result.info,
                },
            })
        } else {
            throw new Error('Delivery failed')
        }
    },
    { connection }
)

worker.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}`, err)
})

worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`)
})
