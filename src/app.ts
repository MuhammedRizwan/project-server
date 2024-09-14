import express,{Application} from 'express'
import http from 'http'
import dotenv from 'dotenv'
import expressConfig from './frameworks/web/express'
import serverConfig from './frameworks/web/server'
import { connection } from './adapters/database/connect'

dotenv.config();

const app:Application=express();
const server=http.createServer(app);
connection()
expressConfig(app);
serverConfig(server).startServer();

