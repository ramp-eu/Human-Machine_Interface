// server.js

// set up ======================================================================
const port = 8081;
// get all the tools we need
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');
const inithmiinstance = require('./config/inithmiinstance.js');
const initconfig = require('./config/initconfig.js');
const inittestconns = require('./config/inittestconns.js');
const inituser = require('./config/inituser.js');
const initbuttons = require('./config/initbuttons.js');
const cleanup = require('./config/cleanup.js');
const gracefulShutdown = require('http-graceful-shutdown');
const pjson = require('./package.json');

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, {useNewUrlParser: true});

require('./config/passport')(passport); // pass passport for configuration

// HMI initiation
inithmiinstance.init();
initconfig.init(process.env.ocb_host, process.env.ocb_port,
    process.env.ngsi_proxy_host, process.env.ngsi_proxy_port);
inittestconns.test(process.env.ocb_host, process.env.ocb_port,
    process.env.ngsi_proxy_host, process.env.ngsi_proxy_port);
inituser.init(process.env.inituser, process.env.initpw);
initbuttons.init(process.env.ocb_host, process.env.ocb_port);

// set up our express application
app.use(express.static('public'));
app.use(morgan('combined', { // log only error responses
  skip: function(req, res) {
    return res.statusCode < 400;
  },
}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'S4l41n3n4v41n', // session secret
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);

// launch ======================================================================
const server = app.listen(port);
console.log('Server version ' + pjson.version + ' started at ' +
            new Date().toISOString() + ' on port ' + port);

// this enables the graceful shutdown with advanced options
gracefulShutdown(server,
    {
      signals: 'SIGINT SIGTERM',
      timeout: 30000,
      development: false,
      onShutdown: cleanup.cleanOCB,
      finally: function() {
        console.log('Server gracefully shut down at ' +
                        new Date().toISOString());
      },
    },
);
