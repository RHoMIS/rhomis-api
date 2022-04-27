var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UnitsLogSchema = new Schema({
    dataType: String,
    formID: String,
    projectID: String,
    data: Object,
    dateArchived: {type:Date, default: () => new Date()}
},
    { collection: 'units_and_conversions_log' });

module.exports = mongoose.model('units_and_conversions_log', UnitsLogSchema);