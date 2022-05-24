var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectDataSchema = new Schema({
    projectID: String,
    formID: String,
    dataSets: Object,
    units: Object,
    // centralProject: {type:Boolean, default: true, required:true},
    unitsExtracted: {type:Boolean, default: false},
    unitsConfirmed: {type:Boolean, default: false},
    pricesCalculated: {type:Boolean, default: false},
    pricesConfirmed: {type:Boolean, default: false},
    finalIndicators: {type: Boolean, default: false}
},
    { collection: 'projectData' });

module.exports = mongoose.model('projectData', projectDataSchema);

