const _ = require('lodash');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const ObjectId = mongoose.Types.ObjectId;


module.exports.findById = findUserById;
module.exports.getAll = getAllUsers;
module.exports.update = updateUser;
module.exports.delete = deleteUser;
module.exports.getAuthUser = getAuthUser;

function findUserById(req, res, next) {
  if (!ObjectId.isValid(req.params.userId)) {
    return res.status(404).json({ message: '404 not found.'});
  }

  User.findById(req.params.userId, (err, user) => {
    if (err) {
      next(err);
    } else if (user) {
      req.resources.user = user;
      next();
    } else {
      next(new Error('failed to find user'));
    }
  });
};

function getAllUsers(req, res, next) {
  User.find((err, users) => {
    if (err) {
      return next(err);
    }

    req.resources.users = users;
    next();
  });
};

function updateUser(req, res, next) {
  var user = req.resources.user;
  _.assign(user, req.body);

  user.save((err, updatedUser) => {
    if (err) {
      return next(err);
    }

    res.resources.user = updatedUser;
    next();
  });
};

function deleteUser(req, res, next) {
  req.resources.user.remove((err) => {
    if (err) {
      return next(err);
    }

    res.status(204).json();
  });
}


function getAuthUser(req, res, next) {
  if (req.user.roles.indexOf('owner') !== -1 || req.user.roles.indexOf('member') !== -1) {
    return Company.findOne({ members: req.user._id }, (err, company) => {
      console.log(company);
      if (err) {
        return next(err);
      }

      var user = req.user.toObject();
      user.company = company;
      res.json(user);
    });
  }

  res.json(req.user);
}