import { logger } from '../../../lib/winston.js';
import tokenModel from '../../../../models/token.js';
import config from '../../../config/index.js';
import { TokenExpiredError } from 'jsonwebtoken';
import token from '../../../../models/token.js';


const logout = async (req, res) => {
    const { email, password } = req.body;
    try {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            await tokenModel.deleteOne({ token: refreshToken });
            logger.info('Refresh token not provided during logout',{
                userid : req.user.id,
                token : refreshToken
            });
        }
        // Remove the refresh token from the database
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        await tokenModel.deleteOne({ token: refreshToken });
        res.sendStatus(204);
        logger.info('User logged out', {
            userid: req.user.id,
            token: refreshToken
        });
        
    } catch (err) {
        logger.error('error during login', { error: err.message, stack: err.stack });
        res.status(500).json({ code: 'ServerError', message: 'An error occurred while logging out', error: err.message });
    }
};

export default logout;