const {ErrorResponse} = require('../utils/common');
const {UserService} = require('../services')
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');

function validateAuthRequest(req, res, next){
    
    if(!req.body.email){
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["email not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    
    if(!req.body.password){
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["password not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}


async function checkAuth(req, res, next){
    if(!req.headers['x-access-token']){
        ErrorResponse.message = "Something went wrong while verifying token";
        ErrorResponse.error = new AppError(["token not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }

    try{
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){
            req.user = response
            next();
        }
    }
    catch(error){
        return res
            .status(error.statusCode)
            .json(error);
    }
}

async function isAdmin(req, res, next){
    const response = await UserService.isAdmin(req.user.email);
    if(!response){
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({message: 'User not authorized for this action'});
    }
    next();
}


module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin,
}