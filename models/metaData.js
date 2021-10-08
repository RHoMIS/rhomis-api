var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var metaDataSchema = new Schema({
    dataType: String,
    formID: String,
    projectID: String,
    data: Object
},
    { collection: 'metaData' });

module.exports = mongoose.model('metaData', metaDataSchema);