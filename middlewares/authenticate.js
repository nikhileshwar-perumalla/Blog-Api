import jwt from 'jsonwebtoken';
import { logger } from '../src/lib/winston.js';
import { verifyAccessToken } from '../src/lib/jwt.js';


const authenticate = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({ code : 'AuthError', message : 'No token provided'});
    }
    const token = authHeader.split(' ')[1];
    try{
        const payload = verifyAccessToken(token);
        req.user = { id : payload.userid };
        next();
    }
    catch(err){
        if(err instanceof jwt.TokenExpiredError){
                logger.info('Access token expired', { error: err.message });
            return res.status(401).json({ code: 'AuthError', message: 'Access token expired' });
        }
        if(err instanceof jwt.JsonWebTokenError){
            logger.info('Invalid access token', { error: err.message });
            return res.status(401).json({ code: 'AuthError', message: 'Invalid access token' });
        }
        res.status(500).json({ code: 'ServerError', message: 'An error occurred while verifying token', error: err.message });
    logger.warn('Invalid access token', { error: err.message });
        return;

    }
}


export default authenticate;