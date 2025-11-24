const express = require('express')
const router = express.Router()

const tenantResolver = require('../middleware/tenantResolver')
const { requireAnyRole, requireRole } = require('../middleware/role')
const {
    createTemplate,
    getTemplates,
    renderTemplateById,
    updateTemplate,
    deleteTemplate,
    getVersions,
    renderVersion,
} = require('../controllers/templateController')

router.use(tenantResolver)

//owner + admin create, update, delete template
router.post('/', requireAnyRole(['owner', 'admin']), createTemplate)
router.put('/:id', requireAnyRole(['owner', 'admin']), updateTemplate)
router.delete('/:id', requireAnyRole(['owner', 'admin']), deleteTemplate)

//everyone list templates
router.get('/', requireAnyRole(['owner', 'admin', 'member']), getTemplates)

//render template (all role)
router.post(
    '/render',
    requireAnyRole(['owner', 'admin', 'member']),
    renderTemplateById
)

//get template versions (admin + owner)
router.get('/:id/versions', requireAnyRole(['owner', 'admin']), getVersions)

//render template versions (all role)
router.post(
    '/renderVersion',
    requireAnyRole(['owner', 'admin', 'member']),
    renderVersion
)

module.exports = router
