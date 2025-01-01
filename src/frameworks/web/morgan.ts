import fs from 'fs'
import path from 'path'

export const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });