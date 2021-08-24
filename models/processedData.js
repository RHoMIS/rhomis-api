var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var processedDataSchema = new Schema({
    projectID: String,
    formID: String,
    data: Object
},
    { collection: 'processedData' });

module.exports = mongoose.model('processedData', processedDataSchema);
