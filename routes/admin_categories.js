const express = require('express');
const router = express.Router();


// Get Page model
var Category = require('../models/category');

//GET Category index page
router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err)
            return console.log(err);
            var title = 'Categories';
        res.render('admin/categories', {
            categories: categories,
            title:title
        });
    });
});

//GET add category
router.get('/add-category',(req,res)=>{
   var title;
   var slug;
   res.render('admin/add_category',{
        title: title,
        slug: slug,
   });
});

//POST add category
router.post('/add-category',(req,res)=>{
   // res.render('index',{title:'Home'});
   req.checkBody('title', 'Title must have a value').notEmpty();
   var title = req.body.title;
   var slug = title.replace(/\s+/g, '-').toLowerCase();

   var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
            slug: slug,
        });
    } else {
        Category.findOne({slug:slug},(err, category)=>{
            if(category){
                req.flash('danger', 'Category slug exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug,
                });

                category.save((err)=>{
                    if (err)
                        return console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });
                    req.flash('success', 'Category Added!');
                    res.redirect('/admin/categories');
                });
            }
        });
        console.log('success');
    }
});

//POST edit category
router.post('/edit-category/:id',(req,res)=>{
    // res.render('index',{title:'Home'});
    req.checkBody('title', 'Category Title exists, choose another.').notEmpty();
   
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.body.id;
    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id:id
        });
    } else {

        Category.findOne({slug:slug, _id:{'$ne':id}},(err, category)=>{
            if(category){
                req.flash('danger', 'Category Title exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                    Category.findById(id, (err, category)=>{
                        if(err) 
                        return console.log(err);

                        category.title = title;
                        category.slug = slug;

                        category.save((err)=>{
                        if(err) return console.log(err);
                        
                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });
                        req.flash('success', 'Page Added!');
                        res.redirect('/admin/categories/edit-category/'+category._id);
                    });
                    }); 
            }
        });
        console.log('success');
    }
});

//Get Edit category
router.get('/edit-category/:id',(req,res)=>{
    Category.findById(req.params.id, (err,category)=>{
        if(err){
            return console.log(err);
        }
        res.render('admin/edit_category',{
            title: category.title,
            slug: category.slug,
            id: category._id
        })
    })
    
})

//GET Delete category
router.get('/delete-category/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id, (err,category)=>{
        if(err){
            return console.log(err);
        }

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        req.flash('success', `Category ${ category.title } deleted!`);
        res.redirect('/admin/categories/');
    });
    
});



//Sort pages 
router.post('/reorder-pages',(req,res)=>{
    var ids = req.body['id[]'];
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                });
            });
        })(count);

    }
})
module.exports =  router;