import { Router } from "express";
import register from '../../controllers/V1/Auth/register.js';
import { body, cookie } from "express-validator";
import validationError from '../../../middlewares/validationError.js';
import  User from '../../../models/user.js';
import bcrypt from 'bcrypt';
import login from "../../controllers/V1/Auth/login.js";
import refreshToken from '../../controllers/V1/Auth/refresh_token.js';


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


router.post('/login',
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error('User email or password is invalid');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom(async (value, { req }) => {
            const { email } = req.body;
            // find user and include password
            const user = await User.findOne({ email }).select('+password').lean().exec();
            if (!user) {
                throw new Error('User email or password is invalid');
            }
            const passwordMatch = await bcrypt.compare(value, user.password);
            if (!passwordMatch) {
                throw new Error('User email or password is invalid');
            }
            return true;
        }),
    validationError,
    login
);


router.post('/refresh_token', 
    cookie('refreshToken')
    .notEmpty()
    .withMessage('NO refresh token')
    .isJWT()
    .withMessage('Invalid RefreshToken'),
    validationError,
    refreshToken);
export default router;
