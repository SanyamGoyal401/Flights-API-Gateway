const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { SECRET_KEY, expiresIn } = require('../../config/server-config');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

 function checkPassword(originalPassword, encryptedPassword){
    try{
        return bcrypt.compareSync(originalPassword, encryptedPassword);
    }
    catch(error){
        throw error;
    }
}


function createToken(payload){
    try{
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn});
        return token;
    }
    catch(error){
        console.log(error);
        throw new AppError('something bad wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function verifyToken(token){
    try{
        return jwt.verify(token, SECRET_KEY);

    }
    catch(error){
        console.log(error);
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    checkPassword,
    createToken,
    verifyToken,
}