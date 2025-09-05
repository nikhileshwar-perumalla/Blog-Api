import { Router } from "express";

import authRoutes from './auth.js';
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

export default router;