var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var cropDataSchema = new Schema({
    projectID: String,
    data: Object
},
    { collection: 'cropData' });

module.exports = mongoose.model('cropData', cropDataSchema);