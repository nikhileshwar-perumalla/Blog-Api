import dotenv from 'dotenv'

dotenv.config();
const config = {
    PORT : process.env.PORT || 3000,
    NODE_ENV : process.env.NODE_ENV || 'development',
    WhiteList : ['http://localhost:3000']//after deployment change it to your domain
}

export default config;