const express = require('express')
const app = express()

app.use("/", require('./web'))
app.use("/api", require("./api"))

module.exports = app