import jwt from 'jsonwebtoken';
import config from '../../../config/index.js';
import { logger } from '../../../lib/winston.js';
import Token from '../../../../models/token.js';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.js';
import User from '../../../../models/user.js';

const refreshToken = async (req, res) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
    if (!incoming) {
      return res.status(401).json({ code: 'AuthError', message: 'No refresh token provided' });
    }

    // Verify token validity
    let payload;
    try {
      payload = jwt.verify(incoming, config.JWT_REFRESH_KEY);
    } catch (err) {
      if(err instanceof jwt.TokenExpiredError){
        logger.info('Refresh token expired', { error: err.message });
        return res.status(401).json({ code: 'AuthError', message: 'Refresh token expired' });
      }
      if(err instanceof jwt.JsonWebTokenError){
        logger.info('Invalid refresh token', { error: err.message });
        return res.status(401).json({ code: 'AuthError', message: 'Invalid refresh token' });
      }
      logger.warn('Invalid refresh token', { error: err.message });
      return res.status(401).json({ code: 'AuthError', message: 'Invalid refresh token' });
    }

    const userid = payload.userid;
    if (!userid) {
      return res.status(401).json({ code: 'AuthError', message: 'Invalid token payload' });
    }

    // Ensure token exists in DB
    const tokenDoc = await Token.findOne({ token: incoming, userId: userid }).lean();
    if (!tokenDoc) {
      return res.status(401).json({ code: 'AuthError', message: 'Refresh token not recognized' });
    }

    // Optionally verify user still exists
    const user = await User.findById(userid).lean();
    if (!user) {
      return res.status(401).json({ code: 'AuthError', message: 'User not found' });
    }

  // Rotate tokens: create new refresh token and access token
  const newAccessToken = generateAccessToken(userid);
    const newRefreshToken = generateRefreshToken(userid);

    // Replace stored refresh token for this user
    await Token.findOneAndUpdate(
      { userId: userid },
      { token: newRefreshToken },
      { upsert: true, new: true }
    );

    // Set cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: parseInt(config.REFRESH_TOKEN_EXPIRY_MS || (7 * 24 * 60 * 60 * 1000), 10)
    });


    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    logger.error('Error refreshing token', { error: err.message, stack: err.stack });
    return res.status(500).json({ code: 'ServerError', message: 'Could not refresh token', error: err.message });
  }
};

export default refreshToken;
