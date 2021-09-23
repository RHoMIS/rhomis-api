var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var moduleSchema = new Schema({
    projectID: String,
    data: Object
},
    { collection: 'moduleData' });

module.exports = mongoose.model('moduleData', moduleSchema);