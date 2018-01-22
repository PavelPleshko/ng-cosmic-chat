const mongoose = require('mongoose');
const Thread = mongoose.model('Thread');
const Message = mongoose.model('Message');
const ObjectId = mongoose.Types.ObjectId;

module.exports.findByThread = findMessagesByThread;

function findMessagesByThread(req, res, next) {
  let query = {
    thread: req.resources.thread._id
  };

  if (req.query.beforeId) {
    query._id = { $lt: new ObjectId(req.query.sinceId) };
  }

  Message
  .find(query)
  .populate('sender')
  .exec(function(err, messages) {
    if (err) {
      return next(err);
    }
console.log(messages)
    req.resources.messages = messages;
    next();
  });
}