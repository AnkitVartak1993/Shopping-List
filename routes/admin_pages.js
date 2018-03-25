const express = require('express');
const router = express.Router();

//GET index page
router.get('/',(req,res)=>{
    res.render('index',{title:'Home'});
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
        console.log('success');
    }
});


module.exports =  router;