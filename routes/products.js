var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


// Get Product model
var Product = require('../models/product');

// Get Category model
var Category = require('../models/category');

// GET all products
router.get('/', function (req, res) {

    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });

});


// Exports
module.exports = router;