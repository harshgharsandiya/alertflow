const admin = require('firebase-admin')
const path = require('path')

const serviceAccountPath = path.join(process.cwd(), process.env.FIREBASE_PATH)
const serviceAccount = require(serviceAccountPath)

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}

async function sendPush({ recipient, content, subject }) {
    try {
        const message = {
            notification: {
                title: subject || 'AlertFlow Notification',
                body: content,
            },
            token: recipient, //device token
        }

        const response = await admin.messaging().send(message)

        return { success: true, info: response }
    } catch (err) {
        console.error('Push error:', err)
        return { success: false, error: err }
    }
}

module.exports = { sendPush }
