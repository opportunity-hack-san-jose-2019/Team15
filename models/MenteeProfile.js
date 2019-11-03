const mongoose = require('mongoose');

const MenteeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  website: {
    type: String
  },
  prefcity: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  ethnicity: {
    type: String
  },
  address: {
    type: String
  },
  bio: {
    type: String,
    required: true
  },
  education: [
    {
      school: {
        type: String
      },
      degree: {
        type: String
      },
      fieldofstudy: {
        type: String
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean
      },
      description: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = MenteeProfile = mongoose.model(
  'menteeProfile',
  MenteeProfileSchema
);
