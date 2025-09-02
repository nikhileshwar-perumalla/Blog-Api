import express, { json } from 'express'
import config from './config/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import v1routes from './routes/V1/index.js';
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
        app.use('/api/v1', v1routes);
    } catch (error) {
        console.error('Error loading v1 routes:', error);
    }

    try {
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


const handleServerShutdown  = async() =>{
    try{
        console.log('Server is Shutting down');
        process.exit(0);
    }
    catch(error){
        console.log('Problem Shutting Error',error);

    }
}

process.on('SIGINT',handleServerShutdown);
process.on('SIGTERM',handleServerShutdown);