var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var processedDataSchema = new Schema({
    projectID: String,
    data: {}
});


var processedData = mongoose.model('processedData', processedDataSchema);
