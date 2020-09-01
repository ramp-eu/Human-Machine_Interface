const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

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
    // by default, local strategy uses username and password,
    // we could override with email
    usernameField: 'userid',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass in the req from our route
    // (lets us check if a user is logged in or not)
  },
  function(req, userid, password, done) {
    // asynchronous
    process.nextTick(function() {
      User.findOne({'userid': userid}, function(err, user) {
        // if there are any errors, return the error
        if (err) {
          return done(err);
        }
        // if no user is found, return the message
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'Login failed.'));
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Login failed.'));
        } else {
          // all is well, return user
          return done(null, user);
        }
      });
    });
  }));
};
