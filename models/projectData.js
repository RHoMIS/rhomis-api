var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectDataSchema = new Schema({
    projectID: String,
    formID: String,
    dataSets: Object,
    units: Object
},
    { collection: 'projectData' });

module.exports = mongoose.model('projectData', projectDataSchema);