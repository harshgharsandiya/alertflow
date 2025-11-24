const prisma = require('../config/prisma')

const { renderTemplate } = require('../utils/templateRenderer')
const { notificationQueue } = require('../queue/notificationQueue')

/**
 * Publich Notification
 * @routes /notifications/publish
 * @method POST
 */
async function publishNotification(req, res) {
    try {
        const { templateId, variables, recipient } = req.body

        if (!templateId || !recipient) {
            return res.status(400).json({
                error: 'templateId and recipient are required',
            })
        }

        const template = await prisma.template.findUnique({
            where: { id: templateId },
        })

        if (!template || template.tenantId !== req.tenant.id) {
            return res.status(404).json({ error: 'Template not found' })
        }

        //render template based on channel
        const renderedContent = renderTemplate(
            template.content,
            variables || {}
        )
        const renderedSubject = template.subject
            ? renderTemplate(template.subject, variables || {})
            : null

        const notification = await prisma.notification.create({
            data: {
                tenantId: req.tenant.id,
                templateId,
                channel: template.channel,
                recipient,
                renderedSubject,
                renderedContent,
                status: 'pending',
                payload: variables || {},
            },
        })

        // push job to Redis Queue
        await notificationQueue.add('sendNotification', {
            notificationId: notification.id,
            channel: notification.channel,
        })

        return res.status(201).json({
            message: 'Notification created and queued',
            notification,
        })
    } catch (err) {
        console.error('publishNotification error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { publishNotification }
