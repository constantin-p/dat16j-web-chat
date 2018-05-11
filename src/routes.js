module.exports = (app, passport) => {
	app.get('/', (req, res) => {
    res.render('index.ejs')
  });

  // Sign in
  app.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs', { message: req.flash('signInMessage') }); 
  });

  app.post('/sign-in', passport.authenticate('sign-in', {
    successRedirect: '/home',
    failureRedirect: '/sign-in',
    failureFlash: true,
  }));


  // Sign up
  app.get('/sign-up', (req, res) => {
    res.render('sign-up.ejs', { message: req.flash('signUpMessage') });
  });

  app.post('/sign-up', passport.authenticate('sign-up', {
    successRedirect: '/home',
    failureRedirect: '/sign-up',
    failureFlash: true 
  }));


  // Sign out
  app.get('/sign-out', (req, res) => {
    req.logout();
    res.redirect('/');
  });


  // HOME | Protected page
  app.get('/home', isLoggedIn, (req, res) => {
    res.render('home.ejs', {
      user: req.user, // Pass the user obj from session
    });
  });
}


const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
  
	res.redirect('/');
}
