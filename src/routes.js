const Message = require('./model/message.js');

module.exports = (app, passport, io) => {
	app.get('/', (req, res) => {
    res.redirect('/sign-in');
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


  // MESSAGES API | Protected
  app.post('/api/messages', isLoggedIn, (req, res) => {
    console.log('Create message ', req.body);
    if (req.body.message) {
      console.log('Create message with body: ', req.body.message);
      var newMessage = new Message();

      newMessage.body = req.body.message;
      newMessage.author = req.user;

      newMessage.save((err) => {
        if (err) {
          res.send(err);
        }

        io.emit('message', newMessage);
        res.json({ message: 'Messages created!' });
      });
    } else {
      console.log(req.body);
      res.status(400).send({ error: 'Missing message content!' })
    }
  })

  app.get('/api/messages', isLoggedIn, (req, res) => {
    console.log('Request messages!');
    Message.find()
    .sort('-createdAt')
    .limit(50)
    .populate({
      path: 'author',
      select: 'email'
    })
    .exec((err, messages) => {
      if (err) {
        res.send(err);
      }

      res.json(messages);
    });
  });
}


const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
  
	res.redirect('/');
}
