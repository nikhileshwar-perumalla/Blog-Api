import { Router } from "express";

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

export default router;