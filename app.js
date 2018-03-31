const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const {dbString} = require('./config/dbconfig');
const bodyParser = require('body-parser');
var session = require('express-session')
var expressValidator = require('express-validator');

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

//set global error variable
app.locals.errors = null;

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));


//express-validator middleware setup
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/', pages);


app.listen(3000,()=>{
    console.log('app started');
});