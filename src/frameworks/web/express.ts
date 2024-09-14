import express, { Application } from 'express'
import cors from 'cors'

import cookieParser from 'cookie-parser'
import router from './routes/router';

const expressConfig = (app: Application) => {
    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/',router);
}
export default expressConfig;