import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import passport from 'passport';

// Load input validation
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';


// Authenticate user
const authenticateUser = (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if(!user) {
      return res.status(400).json({ emailnotfound: "Email not found"});
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if(isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          full_name: user.full_name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token
            });
          }
        )
      }
      else {
        return res
          .status(400)
          .json( {passwordincorrect: "Password Incorrect " });
      }
    });
  });
}


// Register User
const registerUser = (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if(user) {
      return res.status(400).json({ email: "Email already exists "});
    }
    else {
      const newUser = new User({
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender
      });

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
}


// Get current user

const getCurrentUser = (req, res) => {
  passport.authenticate("jwt", { session: false });
  res.json({
    id: req.user.id,
    full_name: req.user.full_name,
    email: req.user.email
  })
}

const deleteUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => user.remove().then(() => res.json({success: true})));
};

const user_controller = {
  registerUser,
  authenticateUser,
  getCurrentUser,
  deleteUser
}

export default user_controller;