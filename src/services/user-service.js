const { UserRepository, RoleRepository } = require('../repositories')
const { StatusCodes } = require('http-status-codes')
const AppError = require('../utils/errors/app-error')
const { checkPassword, createToken, verifyToken } = require('../utils/common/auth')
const { ENUMS } = require('../utils/common')


const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);
        await user.addRole(role);
        return user;
    }
    catch (error) {
        console.log(error);
        if (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            })

            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = checkPassword(data.password, user.password);
        if (!passwordMatch) {
            throw new AppError('Password do not match', StatusCodes.BAD_REQUEST);
        }
        const jwt = createToken({ id: user.id, email: user.email });
        return jwt;
    }
    catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAuthenticated(token) {
    try {
        if (!token) {
            return new AppError('Missing jwt token', StatusCodes.BAD_REQUEST);
        }
        const response = verifyToken(token);
        const user = await userRepository.get(response.id);
        if (!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user;
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error.name == 'JsonWebTokenError') {
            throw new AppError('Token Invalid', StatusCodes.BAD_REQUEST);
        }
        if (error.name == 'TokenExpiredError') {
            throw new AppError('Token Expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function addRoleToUser(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getRoleByName(data.role);
        if (!role) {
            throw new AppError('No role found for the given role', StatusCodes.NOT_FOUND);
        }
        await user.addRole(role);
        return user;
    }
    catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(email) {
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);
        return user.hasRole(adminRole);
    }
    catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin,
}