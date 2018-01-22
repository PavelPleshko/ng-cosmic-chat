const mongoose = require('mongoose');
const Thread = mongoose.model('Thread');

module.exports.allByUser = allThreadsByUser;
module.exports.find = findThread;
module.exports.open = openThread;
module.exports.findById = findThreadById;


function allThreadsByUser(req, res, next) {

  Thread
  .find({
    participants: req.user._id
  })
  .populate('participants')
  .exec((err, threads) => {
    if (err) {
      return next(err);
    }

    req.resources.threads = threads;
    next();
  });
}


function findThread(req, res, next) {
  let query = {};
  if (req.body.userId) {
    query.$and = [
      { participants: req.body.userId },
      { participants: req.user._id.toString() }
    ];
  }

  if (req.body.participants) {
    query.$and = req.body.participants.map(participant => {
      return { participants: participant };
    });
  }

  Thread
  .findOne(query)
  .populate('participants')
  .exec((err, thread) => {
    if (err) {
      return next(err);
    }

    req.resources.thread = thread;
    next();
  });
}


function openThread(req, res, next) {
  var data = {};

  //  If we have already found the thread 
  //  we don't need to create a new one
  if (req.resources.thread) {
    return next();
  }

  data.participants = req.body.participants || [req.user._id, req.body.userId];
  Thread
  .create(data, (err, thread) => {
    if (err) {
      return next(err);
    }

    thread.populate('participants', (err, popThread) => {
      if (err) {
        return next(err);
      }

      req.resources.thread = popThread;
      next();
    });
  });
}


function findThreadById(req, res, next) {
  Thread
  .findById(req.params.threadId, (err, thread) => {
    if (err) {
      return next(err);
    }

    req.resources.thread = thread;
    next();
  });
}