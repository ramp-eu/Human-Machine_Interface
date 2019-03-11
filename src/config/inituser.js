var User = require('../app/models/user');

exports.init = function(id, pw) {

    User.findOne({ 'userid' :  id }, function(err, user) {
        // if there are any errors, return the error
        if (err) return done(err);

        // check to see if theres already a user with that userid
        if (user) {
            return;
        } else {

            // create the user
            var newUser = new User();
            newUser.userid      = id;
            newUser.password    = newUser.generateHash(pw);
            newUser.role        = 'admin';
            newUser.name        = 'admin';

            newUser.save(function(err) {
                if (err) return done(err);
            });
        }
    });
}
