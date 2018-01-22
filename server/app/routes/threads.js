const express = require('express');
const router = express.Router();
const threadCtrl = require('../controllers/thread');
const messageCtrl = require('../controllers/message');
const auth = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const response = require('../helpers/response');

module.exports = router;


router.get(
  '/threads',
  auth.ensured,
  threadCtrl.allByUser,
  response.toJSON('threads')
);

router.post(
  '/thread/open',
  auth.ensured,
  threadCtrl.find,
  threadCtrl.open,
  response.toJSON('thread')
);

router.get(
  '/threads/:threadId',
  auth.ensured,
  threadCtrl.findById,
  authorize.onlyParticipants('thread'),
  response.toJSON('thread')
)


router.get(
  '/threads/:threadId/messages',
  auth.ensured,
  threadCtrl.findById,
  authorize.onlyParticipants('thread'),
  messageCtrl.findByThread,
  response.toJSON('messages')
);