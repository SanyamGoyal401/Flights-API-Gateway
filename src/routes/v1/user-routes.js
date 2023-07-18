const {UserController} = require('../../controllers')
const express = require('express')

const router = express.Router();

router.post('/signup', UserController.createUser)

module.exports = router;
