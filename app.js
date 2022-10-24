
// Getting environment variables
const dotenv = require("dotenv");


// Setting up server
const express = require('express')
const app = express()
//const port = process.env.PORT;


// Configuration files s
let config = require('config'); //we load the db location from the JSON files
const dbHost = config.get('dbConfig.host')
const port = config.get('dbConfig.port')
dotenv.config()
//console.log("Rscript path:" + process.env.RSCRIPTPROCESSDATA)



// Connecting to DB
const mongoose = require('mongoose')

var connectWithRetry = function () {
    console.log("Connecting to datase")
    return mongoose.connect(dbHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec \n ', err);
            setTimeout(connectWithRetry, 5000);
        }
    });

}
connectWithRetry()

const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", dbHost);
});

// db.on("error", (err) => {
//     console.error("connection error:", err);
// });

// Ensuring that queries are not limited by size
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Defining routes


const dataRoute = require("./routes/data")
const metaDataRoute = require("./routes/metaData")
const processDataRoute = require("./routes/processData")
const deleteProjectRoute = require("./routes/deleteProject")
const projectDataRoute = require("./routes/projectData")
const unitsAndConversionsRoute = require("./routes/unitsAndConversions")

app.use("/api/data/", dataRoute)
app.use("/api/meta-data", metaDataRoute)
app.use("/api/process-data", processDataRoute)
app.use("/api/delete-project", deleteProjectRoute)
app.use("/api/project-data", projectDataRoute)
app.use("/api/conversions", unitsAndConversionsRoute)

// Defining a get request for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the RHoMIS API application')
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
