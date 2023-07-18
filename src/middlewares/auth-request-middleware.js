const {ErrorResponse} = require('../utils/common')
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



module.exports = {
    validateAuthRequest,
}