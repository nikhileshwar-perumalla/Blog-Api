import dotenv from 'dotenv'

dotenv.config();
const config = {
    PORT : process.env.PORT || 3000,
    NODE_ENV : process.env.NODE_ENV || 'development',
    WhiteList : ['http://localhost:3000'],//after deployment change it to your domain
    MONGO_URI : process.env.MONGO_URI,
    LOG_LEVEL : process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_KEY : process.env.JWT_ACCESS_KEY,
    JWT_REFRESH_KEY : process.env.JWT_REFRESH_KEY,
    ACCES_TOKEN_EXPIRY : process.env.ACCES_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY,
    WhiteList_EMAILS : process.env.WhiteList_EMAILS ? process.env.WhiteList_EMAILS.split(',') : []
}

export default config;