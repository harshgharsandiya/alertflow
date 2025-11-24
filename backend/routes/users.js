const express = require('express')
const router = express.Router()

const tenantResolver = require('../middleware/tenantResolver')
const { createUser, getUsers } = require('../controllers/userController')
const { requireRole, requireAnyRole } = require('../middleware/role')

router.use(tenantResolver)

//only owner can create user
router.post('/', requireRole('owner'), createUser)

//owner and admin can list user
router.get('/', requireAnyRole(['owner', 'admin']), getUsers)

module.exports = router
