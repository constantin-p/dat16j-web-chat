const express  = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const DBConfig = require('./config/db_secrets.js');
const SESSIONConfig = require('./config/session_secrets.js');
const configPassport = require('./config/passport');
const configRoutes = require('./routes');


mongoose.connect(DBConfig.url);


// Configure express
// log requests
app.use(morgan('dev'));
// parse html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// use ejs for templating
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
// setup public folder for assets (css)
app.use(express.static(__dirname + '/public'));

// Configure passport
configPassport(passport);

app.use(session({
	secret: SESSIONConfig.secret,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


configRoutes(app, passport);
app.listen(port, () => {
	console.log('Server listening on port: ' + port);
});


