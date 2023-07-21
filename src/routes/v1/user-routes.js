const {UserController} = require('../../controllers')
const express = require('express')
const {AuthRequestMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', AuthRequestMiddleware.validateAuthRequest, UserController.createUser);
router.post('/signin',AuthRequestMiddleware.validateAuthRequest, UserController.signin);
router.post('/role', AuthRequestMiddleware.checkAuth, AuthRequestMiddleware.isAdmin, UserController.addRoleToUser);
module.exports = router;
