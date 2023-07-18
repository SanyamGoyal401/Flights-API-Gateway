const {UserRepository} = require('../repositories')
const {StatusCodes} = require('http-status-codes')
const AppError = require('../utils/errors/app-error')
const {checkPassword, createToken} = require('../utils/common/auth')
const userRepository = new UserRepository();


async function createUser(data){
    try{
        const user = await userRepository.create(data);
        return user;
    }
    catch(error){
        console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            })
            
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function signin(data){
    try{
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = checkPassword(data.password, user.password);
        if(!passwordMatch){
            throw new AppError('Password do not match', StatusCodes.BAD_REQUEST);
        }
        const jwt = createToken({id: user.id, email: user.email});
        return jwt;
    }
    catch(error){
        console.log(error)
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signin
}