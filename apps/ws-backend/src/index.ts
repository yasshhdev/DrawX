import jwt from "jsonwebtoken"
import { WebSocketServer , WebSocket} from "ws";
import "dotenv/config"
import {getJwtSecret} from "@repo/backend-common/config"
import {prismaclient} from "@repo/db/schema"



const JWT_SECRET = getJwtSecret();
console.log(JWT_SECRET)


const rooms: Record<string,WebSocket[]> = {};
const ws = new WebSocketServer({port:3030}) 


function userauth(token:string):number|null{
    
    try {
      const payload  =  jwt.verify(token,JWT_SECRET)
      
      if(typeof payload == "string" ) {throw new Error(`payload should be of type JWTpayload not string`)}
    
      if(!payload || !payload.userId) {throw new Error (`payload dosent contains the userid `)}

      return payload.userId;

    } catch (err){
        console.log(err)
        return null 
    }


}

async function addchat(text:string,userid:number,roomid:number){

    try {

          const add = await prismaclient.chats.create({
            data:{

                messages:text,
                userid:userid,
                roomid:roomid

            }
        })
    } catch(err) {
        return  console.log(`error while inserting chats in db ${err}`)
    }

   
    

}

ws.on("connection",async (socket,requesturl)=>{


    console.log("an user connnected")

    // if sending token in url only 
    let currentroom :string | null = null 
    let username :string | null= null 
    let roomid:number|null|undefined = null

    
    if(!requesturl){
        return;
    }
    const url= requesturl.url;

    const queryParams =new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token") || "";
  
     const userId = userauth(token);
     if(!userId){socket.close();}
     if(userId===null) {return console.log(`dont get the userid from the token`) }  
         

    
    socket.on("message",async (msg)=>{

    const data = JSON.parse(msg.toString())

    // alternative - if we send token on "socket.onopen" from fe
    
   
    // if(data.type === "auth"){
    //     const token = userauth(data.token)
    // }

    

    if(data.type==="join"){



       
        currentroom = data.room;
   
        if(!currentroom) {return console.log(`user didnt provided the room name`) }
        


       try {


        const upsert = await prismaclient.rooms.upsert({     // upsert = update + insert 
            where:{
                roomname:currentroom
            },
            update:{},      // update nothing if room already exist 
            create:{
                roomname:currentroom,
                admin:userId
                
            }
        })

        roomid = upsert?.id;


       }catch (err){
        console.log(`room resolution failed`)
       }
       


        if(!rooms[currentroom]){
            rooms[currentroom] = [];
            

        console.log("room created successfully in memory")

        } 
        


            rooms[currentroom]?.push(socket)

            username= data.username;

    
        // hydrate 

        let messages;

        if(roomid===null || roomid===undefined) {return console.log(`roomid is undefined or null while hydrating chats`)}

        try {

            messages = await prismaclient.chats.findMany({
                where:{roomid:roomid},
                orderBy:{"id":"asc"},
                take:20
            })
        }catch(err){
            console.log(`error while hydrating chats ${err}`)
            socket.close();
            return;
        }

        socket.send(JSON.stringify({
            type:"history-chat",
            messages
        }))


         console.log("Room joined and hydrated:", currentroom);

            
    
            
    }

    if (data.type==="chat"){
        if(!currentroom) {return}

        rooms[currentroom]?.forEach(user => {
            if(user.readyState == WebSocket.OPEN) {
                user.send(JSON.stringify({
                    type:"current-chat",
                    text:data.text,
                    room:currentroom, 
                    sender:username
                }))
            }
        });
        

         console.log("new msg came")
        if(roomid===null || roomid===undefined) {return console.log(`roomid is undefined or null while adding chats in db`)}
        const chatadd = addchat(data.text,userId,roomid);
    }
  

    })

     socket.on("close",()=>{
        


        if(!currentroom) {return console.log(`a client disconnectred without joining a room`)}

        const sockets = rooms[currentroom]
        if(!sockets) {return console.log(`rooms dont have this socket connection in memory already`)}

        
        rooms[currentroom]=sockets.filter((s)=>{return s !== socket})

      
        if(rooms[currentroom]?.length===0){
            delete rooms[currentroom]
            console.log(`an empty room named ${currentroom} deleted` )
        }

        console.log("a client disconnected")
        
     })



})














