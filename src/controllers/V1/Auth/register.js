import { logger } from '../../../lib/winston.js';
import config from '../../../config/index.js';
import User from '../../../../models/user.js';
import { genUsername } from '../../../../utils/index.js';

const register = async (req, res) => {
    const { email, password, role, username } = req.body;

    try {
        // Use provided username or auto-generate one
        const finalUsername = username && username.trim() !== '' ? username : genUsername();
        const newuser = await User.create({
            username: finalUsername,
            email,
            password,
            role
        });

        res.status(201).json({
            message: "new User Registered",
            user: {
                username: newuser.username,
                email: newuser.email,
                role: newuser.role
            }
        });
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