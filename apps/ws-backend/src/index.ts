import jwt, { JwtPayload } from "jsonwebtoken"
import { WebSocketServer } from "ws";
import "dotenv/config"
import {getJwtSecret} from "@repo/backend-common/config"


const JWT_SECRET = getJwtSecret();
console.log(JWT_SECRET)


const rooms: Record<string,WebSocket[]> = {};

const ws = new WebSocketServer({port:3030})


function userauth(token:string):string|null{

      const payload  =  jwt.verify(token,JWT_SECRET)
      
      if(typeof payload == "string" ) {return null}
    
      if(!payload || !payload.userid) {return null}

      return payload.userid;

}

ws.on("connection",(socket,requesturl)=>{

    // if sending token in url only 
     
    if(!requesturl){
        return;
    }
    const url= requesturl.url;

    const queryParams =new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token") || "";
  
     const userid = userauth(token);
     if(!userid){socket.close;}


    socket.on("message",msg=>{

    // alternative - if we send token on "socket.onopen" from fe
    
    // const data = JSON.parse(msg.toString())
   
    // if(data.type === "auth"){
    //     const token = userauth(data.token)
    // }


    })

})






























// let rooms : Record<string,WebSocket[]>={}

// const wss = new WebSocketServer({port:4000});

// wss.on("connection",(socket,req)=>{

//     const url = req.url;
//     const queryParam = new URLSearchParams(url?.split('?')[1])
//     const token = queryParam.get("token")??""

//     const verify = jwt.verify(token,JWT_SECRET!) // payload | strign 
    
//     if(typeof(verify)=="string"){socket.close; return} // we need payload 

//     if(!verify || !verify.userid){
//         socket.close;
//         return;
//     }

//     const userid = verify.userid;
//     let currentroom : string | null | undefined = null ; 
//     let username : string | null  = null; 

//      socket.on ("message",data=>{

//         let msg = JSON.parse(data.toString())

//         if(msg.type=== "join")
//         {
//             currentroom = msg.room ;

//             if(!currentroom) {return}

//             if(!rooms[currentroom]) {rooms[currentroom]=[]}
            
//             rooms[currentroom]?.push(socket)

//             username = msg.username;
//             console.log("Joined successfully")
//         }

//         if(msg.type === "chat"){

//             if(!currentroom){return}

//             rooms[currentroom]?.forEach((c)=>{
//                 if(c.readyState == WebSocket.OPEN)
//                 {
//                     c.send(JSON.stringify({
//                         text:msg.text,
//                         room:currentroom,
//                         sender : username 
//                     }))
//                 }
//             })
//         }

//     })

//     socket.on("close",()=>{console.log("An client disconnected")})




// })