const mongoose = require('mongoose');

//page schema
var ProductSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    sorting:{
        type: Number,
    },
    image:{
        type: String
    },

    slug:{
        type: String
    }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);
