const mongoose = require('mongoose');

//page schema
var PageSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    sorting:{
        type: Number,
    },
    slug:{
        type: String
    }
});

var Page = module.exports = mongoose.model('Page', PageSchema);
