var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UnitsSchema = new Schema({
    dataType: String,
    formID: String,
    projectID: String,
    data: Object
},
    { collection: 'units_and_conversions' });

module.exports = mongoose.model('units_and_conversions', UnitsSchema);