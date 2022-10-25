var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectDataSchema = new Schema({
    projectID: String,
    formID: String,
    dataSets: Object,
    units: Object,
    // centralProject: {type:Boolean, default: true, required:true},
    rawDataExtracted: {type:Boolean, default: false},
    unitsExtracted: {type:Boolean, default: false},
    unitsConfirmed: {type:Boolean, default: false},
    pricesCalculated: {type:Boolean, default: false},
    pricesConfirmed: {type:Boolean, default: false},
    finalIndicators: {type: Boolean, default: false},
    time_updated:{type:Object, default: {
        rawDataExtracted: null,
        unitsExtracted: null,
        pricesCalculated: null,
        finalIndicators: null
    }},
    zip_file_path: String
},
    { collection: 'projectData' });

module.exports = mongoose.model('projectData', projectDataSchema);

