import jwt, { JwtPayload } from "jsonwebtoken"
import { WebSocketServer } from "ws";
import "dotenv/config"
import {getJwtSecret} from "@repo/backend-common/config"


const JWT_SECRET = getJwtSecret();
console.log(JWT_SECRET)


const wss = new WebSocketServer({port:4000});

wss.on("connection",(socket,req)=>{

    const url = req.url;
    const queryParam = new URLSearchParams(url?.split('?')[1])
    const token = queryParam.get("token")??""

    const verify = jwt.verify(token,JWT_SECRET!) // payload | strign 
    
    if(typeof(verify)=="string"){socket.close; return} // we need payload 

    if(!verify || !verify.userid){
        socket.close;
        return;
    }

    const userid = verify.userid;



})