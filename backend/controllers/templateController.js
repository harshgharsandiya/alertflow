const prisma = require('../config/prisma')
const { renderTemplate } = require('../utils/templateRenderer')

const allowedChannels = ['email', 'sms', 'push', 'inapp']

/**
 * Create Template
 */

async function createTemplate(req, res) {
    try {
        const { name, subject, content, channel } = req.body

        if (!name || !content) {
            res.status(400).json({
                error: 'name, content and channle are required.',
            })
        }

        if (!channel || !allowedChannels.includes(channel)) {
            return res.status(400).json({
                error: 'Invalid channel. Must be email | sms | push | inapp',
            })
        }

        const template = await prisma.template.create({
            data: {
                tenantId: req.tenant.id,
                name,
                channel,
                subject,
                content,
            },
        })

        //version 1
        await prisma.templateVersion.create({
            data: {
                templateId: template.id,
                version: 1,
                subject,
                content,
                channel,
            },
        })

        return res.status(201).json({
            message: 'Template created',
            template,
        })
    } catch (err) {
        console.error('createTemplate error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * List Templates
 * @routes /templates?channel=email
 */
async function getTemplates(req, res) {
    try {
        const { channel } = req.query

        const where = { tenantId: req.tenant.id }
        if (channel) where.channel = channel

        const templates = await prisma.template.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return res.json({ templates })
    } catch (err) {
        console.error('getTemplates error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Render a template by id using variables
 */
async function renderTemplateById(req, res) {
    try {
        const { templateId, variables } = req.body

        if (!templateId) {
            return res.status(400).json({ error: 'templateId is required' })
        }

        const template = await prisma.template.findUnique({
            where: { id: templateId },
        })

        if (!template || template.tenantId !== req.tenant.id) {
            return res.status(404).json({
                error: 'Template not found',
            })
        }

        //TODO
        /*
            based on template.channel we return res
            1. email
            2. sms
            3. push
            4. inapp
        */

        const output = renderTemplate(template.content, variables || {})

        return res.json({
            templateId,
            rendered: output,
        })
    } catch (err) {
        console.error('renderTemplateById error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Update Templates
 * @method PUT
 * @route /templates/:id
 */
async function updateTemplate(req, res) {
    try {
        const { id } = req.params
        const { name, subject, content } = req.body

        const existing = await prisma.template.findUnique({
            where: { id },
        })

        if (!existing || existing.tenantId !== req.tenant.id) {
            return res.status(404).json({
                error: 'Template not found',
            })
        }

        //Get last version
        const lastVersion = await prisma.templateVersion.findFirst({
            where: { templateId: id },
            orderBy: { version: 'desc' },
        })

        const nextVersion = (lastVersion?.version || 1) + 1

        const updated = await prisma.template.update({
            where: { id },
            data: {
                name: name || existing.name,
                channel: existing.channel,
                subject: subject ?? existing.subject,
                content: content || existing.content,
            },
        })

        await prisma.templateVersion.create({
            data: {
                templateId: id,
                version: nextVersion,
                channel: existing.channel,
                subject: subject ?? existing.subject,
                content: content || existing.content,
            },
        })

        return res.json({
            message: 'Template updated (version created: ' + nextVersion + ')',
            template: updated,
        })
    } catch (err) {
        console.error('updateTemplate error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Update Templates
 * @method DELETE
 * @route /templates/:id
 */
async function deleteTemplate(req, res) {
    try {
        const { id } = req.params

        const existing = await prisma.template.findUnique({
            where: { id },
        })

        if (!existing || existing.tenantId !== req.tenant.id) {
            return res.status(404).json({ error: 'Template not found' })
        }

        await prisma.template.delete({
            where: { id },
        })

        return res.json({
            message: 'Template deleted',
        })
    } catch (err) {
        console.error('deleteTemplate error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Get All Template Version
 * @method GET
 * @route /templates/:id/versions
 */
async function getVersions(req, res) {
    try {
        const { id } = req.params

        const template = await prisma.template.findUnique({
            where: { id },
        })
        if (!template || template.tenantId !== req.tenant.id) {
            return res.status(404).json({ error: 'Template not found' })
        }

        const versions = await prisma.templateVersion.findMany({
            where: { templateId: id },
            orderBy: { version: 'desc' },
        })

        return res.json({ versions })
    } catch (err) {
        console.error('getVersions error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Render specific version
 */
async function renderVersion(req, res) {
    try {
        const { versionId, variables } = req.body

        const version = await prisma.templateVersion.findUnique({
            where: { id: versionId },
        })

        if (!version) {
            return res.status(404).json({ error: 'Version not found' })
        }

        const template = await prisma.template.findUnique({
            where: { id: version.templateId },
        })

        if (!template || template.tenantId !== req.tenant.id) {
            return res.status(403).json({ error: 'Forbidden' })
        }

        const output = renderTemplate(version.content, variables || {})

        return res.json({
            versionId,
            rendered: output,
        })
    } catch (err) {
        console.error('renderVersion error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    createTemplate,
    getTemplates,
    renderTemplateById,
    updateTemplate,
    deleteTemplate,
    getVersions,
    renderVersion,
}
