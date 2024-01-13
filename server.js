import express from 'express'
import { port } from './configs.js'

import cors from 'cors'
import bodyParser from 'body-parser'


const app = express()

app.use(cors({
    origin: '*'
}))

import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/public',express.static(path.join(__dirname, './public')))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

import ComplaintsRoute from './routes/complaints_route.js'
import TicketRoute from './routes/ticket_route.js'

app.use('/api', ComplaintsRoute, TicketRoute)

const main = async () => {
    try{
        let lib = await import('./utils/mongoose_connection.js')
        if(await lib.default){
            app.listen(port, () => console.log(`[server] listening on ${port}`))
            // server.listen(socket_port, () => console.log(`server listening on ${host}:${socket_port}`)) 
        }
    }catch(err){
        logger.error(err.message)
    }
}
main()