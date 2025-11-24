const { sendEmail } = require('./email')
const { sendSMS } = require('./sms')
const { sendPush } = require('./push')
const { sendInApp } = require('./inapp')

async function sendNotificationChannel(notification) {
    const { channel, recipient, renderedSubject, renderedContent } =
        notification

    if (channel === 'email') {
        return sendEmail({
            recipient,
            subject: renderedSubject,
            content: renderedContent,
        })
    }

    if (channel === 'sms') {
        return sendSMS({
            recipient,
            content: renderedContent,
        })
    }

    if (channel === 'push') {
        return sendPush({
            recipient,
            subject: renderedSubject,
            content: renderedContent,
        })
    }

    if (channel === 'inapp') {
        return sendInApp(notification.id)
    }

    return { success: false, error: 'Unknown channel' }
}

module.exports = { sendNotificationChannel }
