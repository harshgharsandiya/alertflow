const nodemailer = require('nodemailer')

async function sendEmail({ recipient, subject, content }) {
    try {
        const tranporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const info = await tranporter.sendMail({
            from: `AlertFlow <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: subject || 'AlertFlow Notification',
            html: content,
        })

        return { success: true, info }
    } catch (err) {
        console.error('Email error:', err)
        return { success: false, error: err }
    }
}

module.exports = { sendEmail }
