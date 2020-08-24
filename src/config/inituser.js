const User = require('../app/models/user');

exports.init = function(id, pw) {
  return new Promise((resolve) => {
    console.log('... creating admin');

    User.findOne({'userid': id}, function(err, user) {
      // if there are any errors, return the error
      if (err) {
        console.log(err);
        resolve();
      }

      // check to see if theres already a user with that userid
      if (user) {
        console.log('... User admin already created found');
        resolve();
      } else {
        // create the user
        const newUser = new User();
        newUser.userid = id;
        newUser.password = newUser.generateHash(pw);
        newUser.role = 'admin';
        newUser.name = 'admin';

        newUser.save(function(err) {
          if (err) console.log(err);
          else console.log('... User admin created');
          resolve();
        });
      }
    });
  });
};
