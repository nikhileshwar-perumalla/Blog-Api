import express, { json } from 'express'
import config from './config/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import limiter from './lib/express_rate_limit.js';


const corsOptions = {
    origin: (origin, callback) => {
        if(config.NODE_ENV === 'development' || config.WhiteList.includes(origin) || !origin){
            callback(null,true);
        }
        else{
            callback(new Error("Error Brother Not allowed"),false)
        }
    }
}
const app = express();
const port = config.PORT;
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());
app.use(limiter);
app.use(compression({
    threshold :1024,
}))
app.use(helmet());

(async () => {
    try{
        app.get('/',(req,res)=> {
            res.json({
                "Name" : "Nikki",
                "Age" : " 21",
                "Hoo" : "Man"
            })
        })
        app.listen(port ,() => {
            console.log(`Server is running on Port : ${port}`);
        })
    }
    catch (error) {
        console.error('Error starting server:', error);
        if(config.NODE_ENV === 'Production'){
            process.exit(1);
        }
    }
})();