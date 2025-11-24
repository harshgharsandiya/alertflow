const express = require('express')
const router = express.Router()

const tenantResolver = require('../middleware/tenantResolver')
const { requireAnyRole } = require('../middleware/role')
const { publishNotification } = require('../controllers/notificationController')

router.use(tenantResolver)

router.post(
    '/publish',
    requireAnyRole(['owner', 'admin', 'member']),
    publishNotification
)

module.exports = router
