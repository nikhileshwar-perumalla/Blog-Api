import { Router } from "express";

import authRoutes from './auth.js';
import userRoutes from './users.js';
import blogRoutes from './blogs.js';
const router = Router();

router.get('/',(req,res)=> {
        res.status(200).json({
            Message : "Api is live",
            status : "ok",
            version :"1.0.0",
            Docs: "<Docs link>",
            timestamp : new Date().toISOString(),
        })
    })

router.use('/auth',authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;