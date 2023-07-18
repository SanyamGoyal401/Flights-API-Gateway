const {UserService} = require('../services')
const {ErrorResponse, SuccessResponse} = require("../utils/common")
const {StatusCodes} = require('http-status-codes')


/**
 * POST:  /signup
 * req.body {email: 'user@gmail.com', password: "dsfj9sdjfoijw09"}
 **/
async function createUser(req, res){
    try{
        const response = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    }
    catch(error){
        ErrorResponse.error = error
        return res.status(error.statusCode)
        .json(ErrorResponse)
    }
}
async function signin(req, res){
    try{
        const response = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    }
    catch(error){
        ErrorResponse.error = error
        return res.status(error.statusCode)
        .json(ErrorResponse)
    }
}

module.exports = {
    createUser,
    signin
}