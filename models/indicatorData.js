var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var indicatorDataSchema = new Schema({
    projectID: String,
    data: Object
},
    { collection: 'indicatorData' });

module.exports = mongoose.model('indicatorData', indicatorDataSchema);