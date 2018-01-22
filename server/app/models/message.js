const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MessageSchema = new Schema({
  sender: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  thread: {
    type: ObjectId,
    required: true,
    ref: 'Thread'
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);