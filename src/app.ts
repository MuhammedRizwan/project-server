import express,{Application} from 'express'
import http from 'http'
import dotenv from 'dotenv'
import expressConfig from './frameworks/web/express'
import serverConfig from './frameworks/web/server'
import { connection } from './frameworks/web/connect'
import Ioconfig from './frameworks/web/socket'

dotenv.config();

const app:Application=express();
const server=http.createServer(app);

connection()
expressConfig(app);
Ioconfig(server);
serverConfig(server).startServer();

