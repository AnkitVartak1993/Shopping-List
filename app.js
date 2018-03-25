const express = require('express');
const path = require('path');

var app = express();

//engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.send('it is working');
})


app.listen(3000,()=>{
    console.log('app started');
});