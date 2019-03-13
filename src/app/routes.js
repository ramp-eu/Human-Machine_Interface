var User = require('./models/user');
var Floorplan = require('./models/floorplan');
var Config = require('./models/config');
var crypto = require('crypto');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
var request = require('request');

var MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47'
}
function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true;
}

module.exports = function(app, passport) {

//     app.post('/upload', isLoggedIn, function(req, res) {        
// 
// 		// asynchronous
//                 process.nextTick(function() {
//                         if (req.user.role !== "admin") {
// 			}
// 		});
// 	});

    // show the home page 
    app.get('/', function(req, res) {
        //res.render('index.ejs');
		res.render('login.ejs', { message: req.flash('loginMessage'), messagepos: '' });
    });
    // show the test page 
    //app.get('/test', isLoggedIn, function(req, res) {
    app.get('/test', function(req, res) {
        if (req.user && req.user.role === "admin")
            res.redirect('/admin');
        else if (req.user && req.user.role === "user")
            res.redirect('/somewhere');
        else res.render('test.ejs', {
            user : req.user
        });
    });

    //app.get('/main', isLoggedIn, function(req, res) {
    //    res.render('main.ejs');
    //});

    // FLOORPLAN SECTION =======================================================
    app.get('/floorplan', function(req, res) {
        res.render('floorplan.ejs');
    });
    //app.get('/api/fp', isLoggedIn, function(req, res, next) {
    app.get('/api/fp', function(req, res, next) {
        Floorplan.find({}, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'No floorplans found.' });
        });
    });
    //app.get('/api/fp/:id', isLoggedIn, function(req, res, next) {
    app.get('/api/fp/:id', function(req, res, next) {
        Floorplan.findById(req.params.id, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'Floorplan not found.' });
        });
     });
    //app.delete('/api/fp/:id', isLoggedIn, function(req, res, next) {
    app.delete('/api/fp/:id', function(req, res, next) {
        Floorplan.findByIdAndDelete(req.params.id, function(err, data) {
            if (err) return next(err);
            if (data.filename) {
                var fpfile = './public/uploads/' + data.filename;
                fs.unlink(fpfile, (err) => {
                    if (err) return next(err);
                    console.log('successfully deleted ' + fpfile);
                    res.send(data);
                });
            }
            else res.status(404).send({ message: 'Floorplan not found.' });
        });
     });
    //app.put('/api/fp/:id', isLoggedIn, function(req, res, next) {
    app.put('/api/fp/:id', function(req, res, next) {
        Floorplan.findByIdAndUpdate(req.params.id,
                                   {'name': req.body.name,
                                    'scale': req.body.scale,
                                    'xoffset': req.body.xoffset,
                                    'yoffset': req.body.yoffset,
                                    'updated': new Date().toISOString()
                                   },
                                   {new: true},
                                   function(err, data) {
                                        if (err) return next(err);
                                        res.send(data);
                                   }
        );
     });
    //app.post('/api/fp', isLoggedIn, function(req, res, next) {
    app.post('/api/fp', function(req, res, next) {
        var upload = multer({storage: multer.memoryStorage()}).single('floorplan');
        upload(req, res, function(err) {
            var buffer = req.file.buffer;
            //console.log(req.file);
            var magic = buffer.toString('hex', 0, 4);
            var filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
            var imgurl = 'uploads/' + filename;
            
            var newFp = new Floorplan();
            newFp.fieldname     = req.file.fieldname;
            newFp.originalname  = req.file.originalname;
            newFp.encoding      = req.file.encoding;
            newFp.mimetype      = req.file.mimetype;
            newFp.size          = req.file.size;
            newFp.filename      = filename;
            newFp.imgurl        = imgurl;
            newFp.name          = req.body.name;
            newFp.scale         = req.body.scale;
            newFp.xoffset       = req.body.xoffset;
            newFp.yoffset       = req.body.yoffset;
            newFp.created       = new Date().toISOString();
            newFp.updated       = new Date().toISOString();
            
            if (checkMagicNumbers(magic)) {
                fs.writeFile('./public/uploads/' + filename, buffer, 'binary', function(err) {
                    if (err) return next(err);
                    newFp.save(function(err, data) {
                        if (err) return next(err);
                        res.send(data);
                    });
                });
            } else {
                //res.send({ "imgurl": "" });
                res.status(422).send({ message: 'Image must be format of png or jpg.' })
            }
        });
    });

    // USER SECTION =======================================================
    // User is created in sigunup in passport.js
    // Get all users
    app.get('/api/user', function(req, res, next) {
        User.find({}, { password: 0}, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'No users found.' });
        });
    });
    // Get a user by mongo id
    app.get('/api/user/:id', function(req, res, next) {
        User.findById(req.params.id, { password: 0}, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'User not found.' });
        });
     });
    
            

    
    // Delete a user by mongo id
    app.delete('/api/user/:id/:ocb_host/:ocb_port', function(req, res, next) {
        User.findByIdAndDelete(req.params.id, { password: 0}, function(err, data) {
            if (err) return next(err);
            if (data.userid) {
                data.password = null;
                res.send(data);
//Code block below was for creating HAN entity to Orion Context Broker
//                 var ocb_url = 'http://' + req.params.ocb_host + ':' + req.params.ocb_port + '/v2/entities/' + data.userid;
//                 request.del(ocb_url, function (err, resp, body) {
//                     if (err) return next(err);
//                     else if (resp.statusCode == 204) {
//                         res.send(data);
//                     } else res.status(resp.statusCode).send(body);
//                 });
            }
            else res.status(404).send({ message: 'User not found.' });
        });
     });
    // Update a user by mongo id
    app.put('/api/user/:id', function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            if (err) return next(err);
            if (user) {
                //user.userid = req.body.userid;
                user.userid = user.userid;
                user.password = user.generateHash(req.body.password);
                user.role = req.body.role;
                user.name = req.body.name;

                user.save(function (err, data) {
                    if (err) return next(err);
                    if (data) {
                        data.password = null;
                        res.send(data);
                    }
                    else res.status(404).send({ message: 'User not found.' });
                });
            } else res.status(404).send({ message: 'User not found.' });
        });
     });
    // Create a user
    app.post('/api/user', function(req, res, next) {
        User.findOne({ 'userid' :  req.body.userid }, function(err, user) {
            if (err) return next(err);
            if (user) res.status(409).send({ message: 'This user id is already created.' });
            else {
                var newUser = new User();
                newUser.userid      = req.body.userid;
                newUser.password    = newUser.generateHash(req.body.password);
                newUser.role        = req.body.role;
                newUser.name        = req.body.name;

                newUser.save(function(err, data) {
                    if (err) return next(err);
                    if (data) {
                        data.password = null;
                        res.send(data);
                    }
                    else res.status(500).send({ message: 'User create failed.' });
                });
//Code block below was for creating HAN entity to Orion Context Broker
//                 var ocb_url = 'http://' + req.body.ocb_host + ':' + req.body.ocb_port + '/v2/entities';
//                 request.post({url:ocb_url,
//                             json : true,
//                             body : {'id':req.body.userid, 'type':'HAN'}},
//                             function(err, resp, body) {
//                                 if (err) return next(err);
//                                 else if (resp.statusCode == 201) {
//                                     var newUser = new User();
//                                     newUser.userid      = req.body.userid;
//                                     newUser.password    = newUser.generateHash(req.body.password);
//                                     newUser.role        = req.body.role;
//                                     newUser.name        = req.body.name;
// 
//                                     newUser.save(function(err, data) {
//                                         if (err) return next(err);
//                                         if (data) {
//                                             data.password = null;
//                                             res.send(data);
//                                         }
//                                         else res.status(500).send({ message: 'User create failed.' });
// 
//                                     });
//                                 } else res.status(resp.statusCode).send(body);
//                             }
//                 );
            }
        });
    });

    
    // CONFIG SECTION =======================================================
    //app.get('/api/config', isLoggedIn, function(req, res, next) {
    app.get('/api/config', function(req, res, next) {
        Config.find({}, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'No configs found.' });
        });
    });
    //app.get('/api/config/:id', isLoggedIn, function(req, res, next) {
    app.get('/api/config/:id', function(req, res, next) {
        Config.findById(req.params.id, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'Config not found.' });
        });
     });
    //app.delete('/api/config/:id', isLoggedIn, function(req, res, next) {
    app.delete('/api/config/:id', function(req, res, next) {
        Config.findByIdAndDelete(req.params.id, function(err, data) {
            if (err) return next(err);
            if (data) res.send(data);
            else res.status(404).send({ message: 'Config not found.' });
        });
     });
    //app.put('/api/config/:id', isLoggedIn, function(req, res, next) {
    app.put('/api/config/:id', function(req, res, next) {
        Config.findByIdAndUpdate(req.params.id,
                                   {'ocb_host': req.body.ocb_host,
                                    'ocb_port': req.body.ocb_port,
                                    'ngsi_proxy_host': req.body.ngsi_proxy_host,
                                    'ngsi_proxy_port': req.body.ngsi_proxy_port,
                                    'curr_floorplan_id': req.body.curr_floorplan_id,
                                    'updated': new Date().toISOString()
                                   },
                                   {new: true},
                                   function(err, data) {
                                        if (err) return next(err);
                                        res.send(data);
                                   }
        );
     });
    //app.post('/api/config', isLoggedIn, function(req, res, next) {
    app.post('/api/config', function(req, res, next) {

        var newConfig = new Config();
        newConfig.ocb_host          = req.body.ocb_host;
        newConfig.ocb_port          = req.body.ocb_port;
        newConfig.ngsi_proxy_host   = req.body.ngsi_proxy_host;
        newConfig.ngsi_proxy_port   = req.body.ngsi_proxy_port;
        newConfig.curr_floorplan_id = req.body.curr_floorplan_id;
        newConfig.created           = new Date().toISOString();
        newConfig.updated           = new Date().toISOString();

        newConfig.save(function(err, data) {
            if (err) return next(err);
            res.send(data);
        });
    });

    // MAIN SECTION =========================
    app.get('/main', isLoggedIn, function(req, res) {
        /*if (req.user.role === "admin")
            res.redirect('/admin');
        else if (req.user.role === "user")
            res.redirect('/somewhere');
        else*/ res.render('main.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage'), messagepos: '' });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            //successRedirect : '/verify',
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an errorl
            failureFlash : true // allow flash messages
        }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
