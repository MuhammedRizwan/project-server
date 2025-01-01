import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import router from './routes/router';
import { errorHandler } from '../../adapters/middleware/errorHandler.middleware';
import { accessLogStream } from './morgan';


const expressConfig = (app: Application) => {
    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan('tiny', { stream: accessLogStream }));
    app.use('/',router);
    app.use(errorHandler)
}
export default expressConfig;