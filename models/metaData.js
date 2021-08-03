const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var metaDataSchema = new Schema({
    projectID: String,
    formID: String
},
    { collection: 'projectData' });

module.exports = mongoose.model('metaData', metaDataSchema);