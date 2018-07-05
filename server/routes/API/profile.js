const express = require('express');
const router = express.Router();
const passport = require('passport');


//@route GET.api/posts/test
//@desc Tests posts route
//@access Public
router.get('/test', (req, res) => res.json({msg: "profile works!"}));

const validateProfileInput = require('../../validation/profile');

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);
// Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if (req.body.handle) profileFields.handle = req.body.handle;

    profileFields.social = {};
    if (req.body.youtube)
        profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter)
        profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook)
        profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin)
        profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram)
        profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {  //Update  } else {  //Create  }
            }

            //Update
            Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            ).then(profile => res.json(profile));

            //Create
// Check if handle exists
            Profile.findOne({handle: profileFields.handle})
                .then(profile => {
// If it exists, we error out
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    }
//Save Profile
                    new Profile(profileFields).save()
                        .then(profile => res.json(profile));
                })
        });

    module.exports = router;
});