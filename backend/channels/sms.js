const fs = require('fs')
const path = require('path')

/**
 * SMS Gateway simulator
 * - Logs sms to console
 * - Saves to sms_logs.txt
 */
async function sendSMS({ recipient, content }) {
    try {
        const logMsg = `[SMS] To: ${recipient} | Message: ${content}\n`

        console.log(logMsg)

        const logPath = path.join(__dirname, '../logs/sms_logs.txt')
        fs.appendFileSync(logPath, logMsg, 'utf8')

        return { success: true, message: 'SMS simulated (not sent)' }
    } catch (err) {
        console.error('SMS error:', err)
        return { success: false, error: err }
    }
}

module.exports = { sendSMS }
