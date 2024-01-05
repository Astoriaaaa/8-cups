const express = require('express')
const app = express()
require('dotenv').config()
const Port = process.env.PORT
const router = require('./routes/routes')

app.use(express.json())
app.use('/', router)

async function start() {
    app.listen(Port, process.env.IP_ADRESS, console.log(`server is running on port ${Port}`))
}

start()

//
// to get IP adress type ipconfig into terminal
