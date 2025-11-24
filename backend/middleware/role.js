function requireRole(role) {
    return function (req, res, next) {
        if (req.user.role !== role) {
            return res
                .status(403)
                .json({ error: 'Forbidden. Requires role: ' + role })
        }
        next()
    }
}

function requireAnyRole(roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden. Allowed roles: ' + roles.join(', '),
            })
        }
        next()
    }
}

module.exports = { requireRole, requireAnyRole }
