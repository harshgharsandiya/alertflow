const crypto = require('crypto')

function generateApiKey() {
    //64-char-key
    return crypto.randomBytes(32).toString('hex')
}

module.exports = { generateApiKey }
