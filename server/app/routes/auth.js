const express = require('express');
const router = express.Router();
//const auth = require('../middlewares/authentication');

router.get('/', function(req,res){
	console.log('hi there');
});


module.exports = router;