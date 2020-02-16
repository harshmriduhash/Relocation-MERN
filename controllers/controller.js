'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = express.Router();
var request = require('request');
var User = require('../models/user.js');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');


//===================================================================

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/register', function(req, res, body) {
    res.render('register');
    // , { invalidLogin: 'Username or Password was incorrect; try again' }
});


router.get('/dashboard', function(req, res, body) {
    if (!req.cookies.loggedIn) {
    	console.log("Not logged in");
    	res.render('index', { errorMsg: 'You must create an account to access re/locate'});
    }else {
    	res.render('dashboard');	
    }
});

// User Registration 
router.post('/dashboard/register', function(req, res) {
	var user = new User(req.body);
	user.save(function(err, doc) {
		if(err) {
			res.send(err);
		} else {
			res.cookie('loggedIn', 'true', {maxAge: 900000, httpOnly: true});
			res.redirect('/dashboard');
		}

	});
});


router.post('/dashboard', (req, res) => {
        let email = req.body.email;
        User.find({ email: email }).then((loginUser) => {
            if (loginUser[0] === undefined) {
                res.render('register', { errorMsg: 'No such user found in the database' });
            } else {
                bcrypt.compare(req.body.password, loginUser[0].password, function (err, result) {
                	// console.log(err, result);
                    if (result === true) {
                        res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
                        res.redirect('/dashboard');
                    } else {
                        res.redirect('/register');
                    }
                });
            }
        });
    });

router.get('/dashboard/logout', function(req, res){
	console.log(req.cookie);
	res.clearCookie('loggedIn');
	res.redirect('/');
})



module.exports = router;
