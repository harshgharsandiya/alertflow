require('dotenv').config()

const app = require('./app')

async function startServer() {
    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

startServer().catch((err) => console.error(err))
