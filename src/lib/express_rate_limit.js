import {rateLimit} from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders :false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    }
});

export default limiter;