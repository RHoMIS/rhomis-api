var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectDataSchema = new Schema({
    dataType: String,
    formID: String,
    projectID: String,
    data: Object
},
    { collection: 'projectData' });

module.exports = mongoose.model('projectData', projectDataSchema);