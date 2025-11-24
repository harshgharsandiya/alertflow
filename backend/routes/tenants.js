const express = require('express')
const router = express.Router()

const { createTenant } = require('../controllers/tenantController')
const tenantResolver = require('../middleware/tenantResolver')

router.post('/', createTenant)

//test route
router.get('/me', tenantResolver, (req, res) => {
    res.json({
        message: 'Tenant Resolve successfully',
        tenant: req.tenant,
    })
})

module.exports = router
