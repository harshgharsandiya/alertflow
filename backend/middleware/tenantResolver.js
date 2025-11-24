const bcrypt = require('bcryptjs')

const prisma = require('../config/prisma')
/**
 * Tenant Resolver Middleware using x-api-key
 */
async function tenantResolver(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key']
        const userId = req.headers['x-user-id']

        if (!apiKey) {
            return res.status(401).json({ error: 'Missing x-api-key header' })
        }
        if (!userId) {
            return res.status(401).json({ error: 'Missing x-user-id' })
        }

        const tenants = await prisma.tenant.findMany()

        let matchedTenant = null
        for (const t of tenants) {
            const match = await bcrypt.compare(apiKey, t.apiKey)
            if (match) {
                matchedTenant = t
                break
            }
        }
        if (!matchedTenant) {
            return res.status(403).json({ error: 'Invalid API key' })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        })
        if (!user || user.tenantId !== matchedTenant.id) {
            return res.status(403).json({ error: 'User not found in tenant' })
        }

        req.tenant = matchedTenant
        req.user = user
        next()
    } catch (err) {
        console.error('tenantResolver error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = tenantResolver
