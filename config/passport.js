const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const dbconfig = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    //Local strat
    passport.use(new LocalStrategy(function(username, password, done) {
        var query = {username:username};
        User.findOne(query, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'No user or wrong password'});
            }

            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (!isMatch) {
                    return done(null, false, {message: 'No user or wrong password'});
                } else {
                    return done(null, user);
                }
            });

            passport.serializeUser(function(user, done) {
                done(null, user.id);
            });

            passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, user) {
                    done(err, user);
                });
            });
        });
    }));
};