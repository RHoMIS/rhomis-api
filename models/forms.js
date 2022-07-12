const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    project: {
        type: String,
    },
    users: {
        type: Object,
    },
    metadata: {
        type: Object,
    },
    centralID: {
        type: String,
    },
    draftVersion: {
        type: String,
        default: null
    },
    liveVersion: {
        type: String,
        default: null
    },
    draft: {
        type: Boolean,
    },
    live: {
        type: Boolean,
    },
    complete: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now
    },
    processed: {
        type: Boolean,
        default: false
    },
    centralForm: {
        type: Boolean,
        default:true,
        required:true
    }

})

module.exports = mongoose.model('Form', formSchema)