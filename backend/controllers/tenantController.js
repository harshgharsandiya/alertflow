const bcrypt = require('bcryptjs')

const prisma = require('../config/prisma')
const { generateApiKey } = require('../utils/apiKey')

/**
 * POST /tenants
 * Body: { name, ownerName, ownerEmail, ownerPassword }
 * Creates tenant and owner user (role = "owner")
 */
async function createTenant(req, res) {
    try {
        const { name, ownerName, ownerEmail, ownerPassword } = req.body

        if (!name || !ownerEmail || !ownerPassword) {
            return res.status(400).json({
                error: 'name, ownerEmail and ownerPassword are required',
            })
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: ownerEmail },
        })

        if (existingUser) {
            return res.status(400).json({
                error: 'Email already exists. Choose a different email.',
            })
        }

        const apiKey = generateApiKey()
        const hashedApiKey = await bcrypt.hash(apiKey, 10)

        const tenant = await prisma.tenant.create({
            data: { name, apiKey: hashedApiKey },
        })

        const hashedPassword = await bcrypt.hash(ownerPassword, 10)

        const owner = await prisma.user.create({
            data: {
                tenantId: tenant.id,
                email: ownerEmail,
                name: ownerName || ownerEmail,
                role: 'owner',
                hashedPassword,
            },
        })

        return res.status(201).json({
            message: 'Tenant created successfully',
            tenant,
            owner: {
                id: owner.id,
                email: owner.email,
                role: owner.role,
            },
            apiKey, //show only plain key once
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { createTenant }
