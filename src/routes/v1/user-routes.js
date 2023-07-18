const {UserController} = require('../../controllers')
const express = require('express')
const {AuthRequestMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', AuthRequestMiddleware.validateAuthRequest, UserController.createUser);
router.post('/signin',AuthRequestMiddleware.validateAuthRequest, UserController.signin);
router.post('/validate', AuthRequestMiddleware.checkAuth, (req, res)=>{
    return res.json(req.user);
})
module.exports = router;
