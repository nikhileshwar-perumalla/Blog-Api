import { logger } from '../../../lib/winston';
import token from '../../../../models/token';
import config from '@/config';


const logout = async (req, res) => {
    const { email, password } = req.body;

    try {

    } catch (err) {
        logger.error('error during login', { error: err.message, stack: err.stack });
        res.status(500).json({ code: 'ServerError', message: 'An error occurred while logging out', error: err.message });
    }
};

export default logout;