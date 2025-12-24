import jwt, { JwtPayload } from "jsonwebtoken"
import { WebSocketServer } from "ws";
import "dotenv/config"
import {getJwtSecret} from "@repo/backend-common/config"


const JWT_SECRET = getJwtSecret();
console.log(JWT_SECRET)

let rooms : Record<string,WebSocket[]>={}

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
    let currentroom : string | null | undefined = null ; 
    let username : string | null  = null; 

     socket.on ("message",data=>{

        let msg = JSON.parse(data.toString())

        if(msg.type=== "join")
        {
            currentroom = msg.room ;

            if(!currentroom) {return}

            if(!rooms[currentroom]) {rooms[currentroom]=[]}
            
            rooms[currentroom]?.push(socket)

            username = msg.username;
            console.log("Joined successfully")
        }

        if(msg.type === "chat"){

            if(!currentroom){return}

            rooms[currentroom]?.forEach((c)=>{
                if(c.readyState == WebSocket.OPEN)
                {
                    c.send(JSON.stringify({
                        text:msg.text,
                        room:currentroom,
                        sender : username 
                    }))
                }
            })
        }

    })

    socket.on("close",()=>{console.log("An client disconnected")})




})