const express = require('express');
const router = express.Router();


// Get Page model
var Page = require('../models/page');

//GET index page
router.get('/',(req,res)=>{
    var title
    Page.find({}).sort({sorting : 1}).exec(function(err,pages){
        res.render('admin/pages',{
            pages: pages,
            title: title
        })
    })
});

//GET add page
router.get('/add-page',(req,res)=>{
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
                    req.flash('success', 'Page Added!');
                    res.redirect('/admin/pages');
                });
            }
        });
        console.log('success');
    }
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