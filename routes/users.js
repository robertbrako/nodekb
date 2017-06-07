const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in Article model
var User = require('../models/user');

router.get('/register', function(req, res) {
    res.render('register', {
        title:'Register',
    });
});

router.post('/register', function(req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    
    req.checkBody('firstname', "Name is required").notEmpty();
    req.checkBody('lastname', "Name is required").notEmpty();
    req.checkBody('email', "Email is required").notEmpty();
    req.checkBody('email', "Email is not valid").isEmail();
    req.checkBody('username', "Username is required").notEmpty();
    req.checkBody('password', "Password is required").notEmpty();
    req.checkBody('password2', "Passwords do not match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            title:'Register',
            errors:errors
        });
        return;
    }
    var newUser = new User({
        firstname:firstname,
        lastname:lastname,
        email:email,
        username:username,
        password:password
    });

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'User ' + newUser.username + ' now registered and can log in');
                    res.redirect('/users/login');
                }
            });
        });
    });
});

// Login Form
router.get('/login', function(req, res) {
    res.render('login', {
        title:'Login',
    });
});

//Login Process
router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;