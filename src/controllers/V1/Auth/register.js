import { logger } from '../../../lib/winston.js';
import config from '../../../config/index.js';
import User from '../../../../models/user.js';
import { genUsername } from '../../../../utils/index.js';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.js'; // path corrected if needed
import token from '../../../../models/token.js'
const register = async (req, res) => {
    const { email, password, role, username } = req.body;

    if(role === 'admin' && !config.WhiteList_EMAILS.includes(email)){
        res.status(401).json({
            code : 'Authorisation required',
            message : 'You cant be admin boss contact Nikhileshwar'
        });
        logger.warn(`User used ${email} main to access admin but you are not supposed to`);
        return;
    }

    try {
        // Use provided username or auto-generate one
        const finalUsername = username && username.trim() !== '' ? username : genUsername();
        const newuser = await User.create({
            username: finalUsername,
            email,
            password,
            role
        });


        const accessToken = generateAccessToken(newuser._id);
        const refreshToken = generateRefreshToken(newuser._id);

    await token.create({ token: refreshToken, userId: newuser._id });
        logger.info("Refresh token added for the user",{
            user : newuser._id,
            token : refreshToken
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production', // set secure flag in production
            sameSite: 'Strict', // adjust as needed
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            message: "new User Registered",
            user: {
                username: newuser.username,
                email: newuser.email,
                role: newuser.role
            }
            , accessToken
        });
        logger.info('new user registered', { userId: newuser._id, email: newuser.email, role: newuser.role });
    } catch (err) {
        res.status(400).json({
            code: 'ServerError',
            message: 'Error has occured',
            error: err.message
        });
        logger.error('error has occurred during registering', { error: err.message, stack: err.stack });
    }
}


export default register;