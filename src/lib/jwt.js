import config from '../config/index.js';
import jwt from 'jsonwebtoken';

// Generate access token with provided user id
export const generateAccessToken = (userid) => {
    if (!userid) throw new Error('userid required for access token');
    return jwt.sign({ userid }, config.JWT_ACCESS_KEY, {
        expiresIn: config.ACCES_TOKEN_EXPIRY,
        subject: 'accessApi'
    });
};

// Generate refresh token with provided user id
export const generateRefreshToken = (userid) => {
    if (!userid) throw new Error('userid required for refresh token');
    return jwt.sign({ userid }, config.JWT_REFRESH_KEY, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'refreshApi'
    });
};


export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_ACCESS_KEY);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.JWT_REFRESH_KEY);
}