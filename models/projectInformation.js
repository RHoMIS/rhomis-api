var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var projectInformationSchema = new Schema({
    projectID: String,
    formID: String,
    data: Object
},
    { collection: 'metaData' });

module.exports = mongoose.model('metaData', projectInformationSchema);