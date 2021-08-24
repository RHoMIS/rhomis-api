
// Getting environment variables
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

// Setting up server
const express = require('express')
const app = express()
//const port = process.env.PORT;


// Configuration files 
let config = require('config'); //we load the db location from the JSON files
const dbHost = config.get('dbConfig.host')
const port = config.get('dbConfig.port')
dotenv.config()

// Connecting to DB
const mongoose = require('mongoose')
mongoose.connect(dbHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", dbHost);
});

db.on("error", (err) => {
    console.error("connection error:", err);
});

// Ensuring that queries are not limited by size
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Defining routes


const dataRoute = require("./routes/data")
const metaDataRoute = require("./routes/metaData")


app.use("/api/data/", dataRoute)
app.use("/api/meta-data", metaDataRoute)


// Defining a get request for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the RHoMIS API application')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})