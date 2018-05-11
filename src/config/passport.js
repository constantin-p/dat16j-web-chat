const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user.js');


const isEmailValid = (input) => {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
}

// http://www.passportjs.org/docs/configure/
module.exports = (passport) => {
	passport.serializeUser((user, done) => {
    done(null, user.id);
  });

	passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });


  passport.use('sign-in', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {
    User.findOne({ 'email' :  email }, (err, user) => {
      if (err != null) {
        return done(err);
      }

      if (!user) {
        return done(null, false, req.flash('signInMessage', 'No user found!')); 
      }

      if (!user.validPassword(password)) {
        return done(null, false, req.flash('signInMessage', 'Wrong password!'));
      }

      // Valid credentials
      return done(null, user);
    });
  }));


  passport.use('sign-up', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {

    if (!isEmailValid(email)) {
      return done(null, false, req.flash('signUpMessage', 'Invalid email address.'));
    }

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(() => {
      // Search for duplicate email
      User.findOne({ 'email' :  email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, req.flash('signUpMessage', 'Email address already taken.'));
        } else {

          // Valid email address -> create the user
          var newUser = new User();

          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          // Save the user
          newUser.save((err) => {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });    
  	});
	}));
}