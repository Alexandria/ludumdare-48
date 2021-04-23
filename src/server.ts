import {createServer, IncomingMessage, ServerResponse} from 'http'


const hostname = 'localhost'
const port = 8080

const serverOptions = (req:IncomingMessage, res:ServerResponse):void =>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end("Hello Word")
}

const server = createServer(serverOptions)

server.listen(port, hostname, ()=>{
    console.log(`Server is running at http://${hostname}:${port}/`);
 
})