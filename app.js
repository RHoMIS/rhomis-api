// Setting up server
const express = require('express')
const app = express()
const port = 3000

// Connecting to DB
const mongoose = require('mongoose')
var rhomisDB = 'mongodb://127.0.0.1/rhomis';
mongoose.connect(rhomisDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Ensuring that queries are not limited by size
const bodyparser = require("body-parser");
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Welcome to the RHoMIS API application')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})