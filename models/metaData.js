var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var metaDataSchema = new Schema({
    projects: Object,
    forms: Object
},
    { collection: 'metaData' });

module.exports = mongoose.model('metaData', metaDataSchema);