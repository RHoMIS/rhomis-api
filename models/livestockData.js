var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var livestockDataSchema = new Schema({
    projectID: String,
    data: Object
},
    { collection: 'livestockData' });

module.exports = mongoose.model('livestockData', livestockDataSchema);