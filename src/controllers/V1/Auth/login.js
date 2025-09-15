import bcrypt from 'bcrypt';
import User from '../../../../models/user.js';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.js';
import tokenModel from '../../../../models/token.js';
import config from '../../../config/index.js';
import { logger } from '../../../lib/winston.js';

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ code: 'ValidationError', message: 'Email and password are required' });
        }

        // Find user and include password (select: false in schema)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ code: 'AuthError', message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ code: 'AuthError', message: 'Invalid credentials' });
        }

    const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await tokenModel.create({ token: refreshToken, userId: user._id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Logged in',
            user: { id: user._id, email: user.email, username: user.username, role: user.role },
            accessToken,
        });
        logger.info('user logged in', { userId: user._id, email: user.email });
    } catch (err) {
        logger.error('error during login', { error: err.message, stack: err.stack });
        res.status(500).json({ code: 'ServerError', message: 'An error occurred while loggin in', error: err.message });
    }
};

export default login;