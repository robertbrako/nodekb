const express = require('express');
const router = express.Router();

//Bring in Article model
var Article = require('../models/article');

router.get('/add', function(req, res) {
    res.render('add_article', {
        title:'Add Article'
    });
});

//Get single article
router.get('/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article:article
        });
    });
});

router.post('/add', function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get Errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('add_article', {
            title:'Add Article',
            errors:errors
        });
        return;
    }

    var article = new Article();
    //time for another dependency (body-parser)
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //insert to db
    article.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
    console.log('Submitted');
    return;
});

//Edit existing article
router.get('/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        });
    });
});

//Update Submit POST Route
router.post('/edit/:id', function(req, res) {
    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //update db: notice Article.update instead of article.save
    var query = {_id:req.params.id};
    Article.update(query, article, function(err) {
        if (err) {
            console.log(err);
            res.end('500');
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
    console.log('Submitted');
    return;
});

//Delete
router.delete('/:id', function(req, res) {
    var query = {_id:req.params.id};
    Article.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    })
});

module.exports = router;