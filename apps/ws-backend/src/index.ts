import jwt, { JwtPayload } from "jsonwebtoken"
import { WebSocketServer , WebSocket} from "ws";
import "dotenv/config"
import {getJwtSecret} from "@repo/backend-common/config"
import {prismaclient} from "@repo/db/schema"


// abt to add try catch blocks

const JWT_SECRET = getJwtSecret();
console.log(JWT_SECRET)


const rooms: Record<string,WebSocket[]> = {};

const ws = new WebSocketServer({port:3030})


function userauth(token:string):number|null{

      const payload  =  jwt.verify(token,JWT_SECRET)
      
      if(typeof payload == "string" ) {return null}
    
      if(!payload || !payload.userId) {return null}

      return payload.userId;

}

async  function createrom(currentroom:string,userId:number){

    const add = await prismaclient.rooms.create({
        data:{
                roomname:currentroom, 
                admin:userId

        }
    })

}




ws.on("connection",(socket,requesturl)=>{


    console.log("an user connnected")

    // if sending token in url only 
    let currentroom :string | null = null 
    let username :string | null= null 
     
    if(!requesturl){
        return;
    }
    const url= requesturl.url;

    const queryParams =new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token") || "";
  
     const userId = userauth(token);
     if(!userId){socket.close();}



    socket.on("message",msg=>{

    const data = JSON.parse(msg.toString())

    // alternative - if we send token on "socket.onopen" from fe
    
   
    // if(data.type === "auth"){
    //     const token = userauth(data.token)
    // }

    

    if(data.type==="join"){
        currentroom = data.room;

        if(!currentroom) {return}
        
        if(!rooms[currentroom]){
            rooms[currentroom] = []

           if(userId===null){return}
            const newroom = createrom(currentroom,userId)
        }

        rooms[currentroom]?.push(socket)

        username= data.username;

        // const useradd =adduser()





        console.log("room created successflly")


    }

    if (data.type==="chat"){
        if(!currentroom) {return}

        rooms[currentroom]?.forEach(user => {
            if(user.readyState == WebSocket.OPEN) {
                user.send(JSON.stringify({
                    text:data.text,
                    room:currentroom, 
                    sender:username
                }))
            }
        });
    }

    

    })

     socket.on("close",()=>{console.log("An client disconnected")})



})














