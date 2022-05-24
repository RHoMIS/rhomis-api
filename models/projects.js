const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    forms: {
        type: Object,
    },
    users: {
        type: Object,
    },
    metadata: {
        type: Object,
    },
    centralID: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now
    },
    
    centralProject:{
        type: Boolean,
        default:true,
        required:true
    }
})

module.exports = mongoose.model('Project', projectSchema)