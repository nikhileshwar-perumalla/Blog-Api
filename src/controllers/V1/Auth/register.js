import { logger } from '../../../lib/winston.js';
import config from '../../../config/index.js';
import User from '../../../../models/user.js';

import { Iuser } from '../../../../models/user.js';
const register = async (req, res) => {
    try{
        res.status(201).json({
            message : "new User Registered",
        })
    }
    catch (err) {
        res.status(400).json({
            code : 'ServerError',
            message : 'Error has occured',
            error : err
        })
        logger.error('error has occurred during registering', { error: err.message, stack: err.stack });
    }
}

export default register;