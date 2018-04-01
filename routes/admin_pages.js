const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

// Get Page model
var Page = require('../models/page');

//GET index page
router.get('/', isAdmin, (req,res)=>{
    var title
    Page.find({}).sort({sorting : 1}).exec(function(err,pages){
        res.render('admin/pages',{
            pages: pages,
            title: title
        })
    })
});

//GET add page
router.get('/add-page', isAdmin, (req,res)=>{
   // res.render('index',{title:'Home'});
   var title;
   var slug;
   var content;

   res.render('admin/add_page',{
        title: title,
        slug: slug,
        content: content
   });
});

//POST add page
router.post('/add-page',(req,res)=>{
   // res.render('index',{title:'Home'});
   req.checkBody('title', 'Title must have a value').notEmpty();
   req.checkBody('content', 'Content must have a value').notEmpty();
   
   var title = req.body.title;
   var content = req.body.content;
   var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
   if (slug == "")
    slug = title.replace(/\s+/g, '-').toLowerCase();

   var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({slug:slug},(err, page)=>{
            if(page){
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save((err)=>{

                    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    });

                    req.flash('success', 'Page Added!');
                    res.redirect('/admin/pages');
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

                        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
        });
                        
                        req.flash('success', 'Page Edited!');
                        res.redirect('/admin/pages/edit-page/'+page._id);
                    });
                    });
                   
            }
        });
        console.log('success');
    }
});

//Get Edit page
router.get('/edit-page/:id', isAdmin, (req,res)=>{
    Page.findById(req.params.id, (err,page)=>{
        if(err){
            return console.log(err);
        }
        res.render('admin/edit_page',{
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        })
    })
    
})

//GET Delete 
router.get('/delete-page/:id', isAdmin, (req,res)=>{
    Page.findByIdAndRemove(req.params.id, (err,page)=>{
        if(err){
            return console.log(err);
        }

        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/');
    });
    
});



//Sort pages 
function sortPages(ids, callback) {
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
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}

// POST reorder pages
router.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
    });

});
module.exports =  router;