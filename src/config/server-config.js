const dotenv = require('dotenv');
const path = require('path')


dotenv.config({path: path.resolve(__dirname, '../../.env')}); 

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    SECRET_KEY: process.env.SECRET_KEY,
    expiresIn: process.env.expiresIn,
}