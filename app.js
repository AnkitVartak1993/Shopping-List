const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const {dbString} = require('./config/dbconfig');

var app = express();
//DB connect
mongoose.connect(dbString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB connected");
});

//engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
app.use('/admin/pages', adminPages)
app.use('/', pages);


app.listen(3000,()=>{
    console.log('app started');
});