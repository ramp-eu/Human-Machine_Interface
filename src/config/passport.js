var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var User = require('../app/models/user');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we could override with email
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, userid, password, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'userid' :  userid }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', req.i18n.__('Login failed.')));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', req.i18n.__('Login failed.')));
                    
                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we could override with some
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, userid, password, done) {
		
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'userid' :  userid }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that userid
                    if (user) {
                        return done(null, false, req.flash('signupMessage', req.i18n.__('This user id is already registered.')));
                    } else {

                        // create the user
                        var newUser = new User();
                        newUser.userid      = userid;
                        newUser.password    = newUser.generateHash(password);
                        newUser.role        = req.body.role;
                        newUser.name        = req.body.name;

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                        return done(null, newUser);

                        });
                    }

                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

};
