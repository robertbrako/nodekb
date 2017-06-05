const express = require('express');
//path included with node by default
const path = require('path');
const mongoose = require('mongoose');

//setup db
mongoose.connect('mongodb://192.168.1.190:27024/nodekb');
var db = mongoose.connection;

//check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//check for db errors
db.on('error', function(err) {
    console.log(err);
});

//Init app
const app = express();

//Bring in models
var Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home route
app.get('/', function(req, res) {
    //read from Article table with empty search params
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title:'Hello',
                articles:articles
            });
        }
    });
});

app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title:'Add Article'
    });
});

app.listen('8080', function() {
    console.log('Server started on p 8080 (as far as container knows)');
});