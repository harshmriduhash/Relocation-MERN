//Dependencies===========================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

//Configure the app======================================
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(process.cwd() + '/public'));

// configure app with morgan and boodyparser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser())

// Database configuration for mongoose
// db: relocate
// mongoose.connect('mongodb://localhost/relocate');
mongoose.connect('mongodb://heroku_6wg162k4:r7ch70cs5kc8gtjg5pofqfi9u3@ds053146.mlab.com:53146/heroku_6wg162k4');
// hook mongoose connection to db
var db = mongoose.connection;

// log any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// log a success message when we connect to our mongoDB collection with no issues
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var User = require('./models/user.js');


// Routes
var routes = require('./controllers/controller.js');
app.use('/', routes);

// app.get('#dropdown1', function(req,res){
//  req.logOut();
//  req.session.destroy(function (err) {
//         res.redirect('/'); 
//     });
// });

//MAKE THE CONNECTION=================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Listening on: ' + PORT);
});

