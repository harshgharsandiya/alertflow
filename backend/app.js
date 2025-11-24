require('dotenv').config()

const express = require('express')
const prisma = require('./config/prisma')

const app = express()
app.use(express.json())

const tenantRoutes = require('./routes/tenants')
const userRoutes = require('./routes/users')
const templateRoutes = require('./routes/templates')
const notificationRoutes = require('./routes/notification')

app.use('/tenants', tenantRoutes)
app.use('/users', userRoutes)
app.use('/templates', templateRoutes)
app.use('/notifications', notificationRoutes)

app.get('/', (req, res) => {
    res.send('Alertflow backend running...')
})

module.exports = app
