import { logger } from '../../../lib/winston.js';
import tokenModel from '../../../../models/token.js';
import config from '../../../config/index.js';

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.headers['x-refresh-token'];

        // Always clear cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        if (refreshToken) {
            await tokenModel.deleteOne({ token: refreshToken });
            logger.info('User logged out and refresh token revoked', {
                userid: req.user?.id,
            });
        } else {
            logger.info('Logout without refresh token provided', { userid: req.user?.id });
        }

        return res.sendStatus(204);
    } catch (err) {
        logger.error('Error during logout', { error: err.message, stack: err.stack });
        return res.status(500).json({ code: 'ServerError', message: 'An error occurred while logging out', error: err.message });
    }
};

export default logout;