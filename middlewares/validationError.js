
import { validationResult } from "express-validator";

const validationError = (req,res,next) => {
    const errors = validationResult(req);
    if( !errors.isEmpty()){
        res.status(400).json({
            code : 'Validation Error',
            Error : errors.mapped(),
        });
        return;
    }
    next();
}

export default validationError;