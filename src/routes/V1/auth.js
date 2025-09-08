import { Router } from "express";
import register from '../../controllers/V1/Auth/register.js';
import { body } from "express-validator";
import validationError from '../../../middlewares/validationError.js';
import  User from '../../../models/user.js'


const router = Router();

router.post('/register',body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({max : 40})
        .withMessage('Email must be less than 40')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async(value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('Email is already in use');
            }
        }),
    body('password').trim().notEmpty().withMessage('password must be there')
    .isLength({ max : 30 ,min : 8}).withMessage('Password must be less than 30 and more than 8 characters'),
    body('role').optional().notEmpty().withMessage('Role must be there')
    .isString().withMessage('role must be only string').isIn(['user','admin']).withMessage('role must be a user or admin'),
    validationError
    , register)

export default router;
