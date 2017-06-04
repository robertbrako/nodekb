const express = require('express');
//path included with node by default
const path = require('path');
//Init app
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home route
app.get('/', function(req, res) {
    var articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'FooBar',
            body: 'This is article eins'
        },
        {
            id: 2,
            title: 'Article Two',
            author: 'FooBar',
            body: 'This is article zwei'
        },
        {
            id: 3,
            title: 'Article Three',
            author: 'FooBar',
            body: 'This is article drei'
        }
    ];
    articles['length'] = 3;
    res.render('index', {
        title:'Hello',
        articles:articles
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