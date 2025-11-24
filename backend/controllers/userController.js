const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')

/**
 * Create a user inside a tenant
 */
async function createUser(req, res) {
    try {
        const { email, name, password, role } = req.body

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'email and password are required' })
        }

        const existingUser = await prisma.user.findUnique({
            where: { tenantId_email: { tenantId: req.tenant.id, email } },
        })

        if (existingUser) {
            return res.status(400).json({
                error: 'Email already exists. Choose a different email.',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                tenantId: req.tenant.id,
                email,
                name: name || email,
                role: role || 'member',
                hashedPassword,
            },
        })

        return res.status(201).json({
            message: 'User created',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        })
    } catch (err) {
        console.error('createUser error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * List all users of the tenant
 */
async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            where: { tenantId: req.tenant.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        return res.json({ users })
    } catch (err) {
        console.error('getUsers error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { createUser, getUsers }
