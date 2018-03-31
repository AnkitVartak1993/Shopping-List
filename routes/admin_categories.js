const express = require('express');
const router = express.Router();


// Get Page model
var Category = require('../models/category');

//GET Category index page
router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err)
            return console.log(err);
            var title = 'Categories'
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
                    req.flash('success', 'Category Added!');
                    res.redirect('/admin/categories');
                });
            }
        });
        console.log('success');
    }
});

//POST edit page
router.post('/edit-page/:slug',(req,res)=>{
   // res.render('index',{title:'Home'});
   req.checkBody('title', 'Page slug exists, choose another.').notEmpty();
   req.checkBody('content', 'Content must have a value').notEmpty();
   
   var title = req.body.title;
   var content = req.body.content;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
   if (slug == "")
    slug = title.replace(/\s+/g, '-').toLowerCase();
   var id = req.body.id;
   var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id
        });
    } else {

        Page.findOne({slug:slug, _id:{'$ne':id}},(err, page)=>{
            if(page){
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                    Page.findById(id, (err, page)=>{
                        if(err) 
                        return console.log(err);

                        page.title = title;
                        page.slug = slug;
                        page.content = content;

                        page.save((err)=>{
                        if(err) return console.log(err);
                    
                        req.flash('success', 'Page Added!');
                        res.redirect('/admin/pages/edit-page/'+page._id);
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

//GET Delete 
router.get('/delete-page/:id',(req,res)=>{
    Page.findByIdAndRemove(req.params.id, (err,page)=>{
        if(err){
            return console.log(err);
        }
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/');
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