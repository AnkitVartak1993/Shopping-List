const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeimg = require('resize-img');

// Get Product model
var Product = require('../models/product');
// Get Category model
var Category = require('../models/category');

//Get Product index
router.get('/', function (req, res) {
    var count;
    var title = 'Products'
    Product.count(function (err, pcount) {
        count = pcount;
    });

    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
            count: count,
            title: title
        });
    });
});

module.exports =  router;