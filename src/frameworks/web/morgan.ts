import fs from 'fs'
import path from 'path'

export const accessLogStream = fs.createWriteStream(path.join('access.log'), { flags: 'a' });