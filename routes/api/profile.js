const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const MentorProfile = require('../../models/MentorProfile');
const MenteeProfile = require('../../models/MenteeProfile');

// @route  GET api/profile/me
// @desc   Get current mentor's profile
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    userType = user.userType;
    if (userType) {
      profile = await MentorProfile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
    } else {
      profile = await MenteeProfile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
    }

    if (!profile) {
      return res.status(400).json({ msg: 'No profile exists for this user' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills are required')
        .not()
        .isEmpty(),
      check('prefcity', 'Preferred city is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      status,
      website,
      prefcity,
      skills,
      ethnicity,
      address,
      bio,
      prev
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (website) profileFields.website = website;
    if (prefcity) profileFields.prefcity = prefcity;
    if (address) profileFields.location = address;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (prev) profileFields.education = prev;
    if (ethnicity) profileFields.ethnicity = ethnicity;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    try {
      user = await User.findById(req.user.id);
      userType = user.userType;
      if (userType) {
        let profile = await MentorProfile.findOne({ user: req.user.id });
        if (profile) {
          // update
          profile = await MentorProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        } else {
          // create
          profile = new MentorProfile(profileFields);
          await profile.save();
          return res.json(profile);
        }
      } else {
        let profile = await MenteeProfile.findOne({ user: req.user.id });
        if (profile) {
          // update
          profile = await MenteeProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        } else {
          // create
          profile = new MenteeProfile(profileFields);
          await profile.save();
          return res.json(profile);
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/profile/mentors
// @desc   Get all Mentor profiles
// @access Public
router.get('/mentors', async (req, res) => {
  try {
    const profiles = await MentorProfile.find().populate('user', [
      'name',
      'avatar'
    ]);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile/mentees
// @desc   Get all Mentee profiles
// @access Public
router.get('/mentees', async (req, res) => {
  try {
    const profiles = await MenteeProfile.find().populate('user', [
      'name',
      'avatar'
    ]);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
