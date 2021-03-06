const express = require('express');
const router = express.Router();

//deals with avatar for the user
const gravatar = require('gravatar');
//encrypt data
const bcrypt = require('bcryptjs');
// Web token
const jwt = require('jsonwebtoken');
// to create a protected route
const passport = require('passport');

//load user model
const User = require('../../models/User');
//load keys
const keys = require('../../config/keys');
//do stuff with the login i dunno
const validateLoginInput = require('../../validation/login');

//@route GET.api/posts/test
//@desc Tests posts route
//@access Public
router.get('/test', (req, res) => res.json({msg: "users works!"}));

//@route POST api/users/register
//@desc Register a user
//@access Public
router.post('/register', (req,res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
            return res.status(400).json({email: "email already exists"});
        } else {
            const avatar = gravatar.url(req.body.email, {
                a: '200', //size of imagee
                r: 'pg', //rating
                d: 'mm' //default image
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                });
            }
        })
});

// @route POST api/users/login
// @desc Login User / return JWT token
// @access Public
router.post('/login', (req,res) => {
    const { errors, isValid } = validateLoginInput(req.body);
// Check Validation
    if(!isValid) {
        //return res.status(400).json(errors);
        errors.password = 'Password invalid';
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

// Find user by email
    User.findOne({ email })
        .then(user => {
// Check for user
            if(!user) {
                return res.status(404).json({errors:'User not found'});
            }
// Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                       //user match
                        //create payload for JWT
                        const payload = {id: user.id, name: user.name, avatar: user.avatar};
                        //sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({ success: true, token: 'Bearer ' + token });
                            }
                        );
                    } else {
                        return res.status(400).json({password:'Password invalid'});
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session:false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;