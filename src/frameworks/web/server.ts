import { Server } from 'http'
import configKeys from '../../config'
import "../cron/sheduleTask"

const serverConfig = (server: Server) => {
    const startServer = () => {
        server.listen(configKeys.PORT, () => {
            console.log(`server listening on:http://localhost:${configKeys.PORT}`)
        })
    };
    return {
        startServer
    };
};
export default serverConfig;