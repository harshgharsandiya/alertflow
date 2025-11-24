const prisma = require('../config/prisma')

/**
 * sendInApp - records an in-app notification as delivered in DB (or marks it ready)
 * Accepts either `notificationId` or a notification object.
 */
async function sendInApp(notification) {
    try {
        const id =
            typeof notification === 'string' ? notification : notification?.id

        if (!id) {
            return { success: false, error: 'notification id required' }
        }

        return { success: true, info: updated }
    } catch (err) {
        console.error('InApp error:', err)
        return { success: false, error: err }
    }
}

module.exports = { sendInApp }
