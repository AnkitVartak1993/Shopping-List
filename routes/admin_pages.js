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

module.exports =  router;