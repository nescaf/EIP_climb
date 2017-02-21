// app/routes.js
module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// LOGIN
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { messages: req.session.messages });
		delete req.session.messages;
	});

	// process the login form
	app.post('/login', function(req, res) {
		passport.authenticate('local-login', function(error, user, infos) {
    	if (error || !user) {
				req.session.messages = infos;
				return res.redirect('/login');
			} else {
				req.login(user.profile, function(err) {
					if (err)
						return next(err);
					return res.redirect('/profile');
				});
			}
  	})(req, res);
	});

	// SIGNUP
	app.get('/signup', function(req, res) {

		// render the page and pass in any data if it exists
		res.render('signup.ejs', { messages: req.session.messages });
		delete req.session.messages;
	});

	// process the signup form
	app.post('/signup', function(req, res) {


	});

	// PROFILE SECTION
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
