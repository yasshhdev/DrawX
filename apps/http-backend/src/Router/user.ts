
import express from "express"
import { Router } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { user_auth } from "../middleware/user_middleware";
import {prismaclient} from "@repo/db/schema"
import { createUserSchema , signinSchema , roomIdValidation} from "@repo/common/zodschema"
import { getJwtSecret } from "@repo/backend-common/config";

 
export const userrouter:Router =  Router();

userrouter.use(express.json());

const JWT_SECRET = getJwtSecret();


userrouter.post("/signup",async (req,res)=>{

    

    const validate = createUserSchema.safeParse(req.body)
    if(!validate.success){return res.status(400).json({
        error:{
            code:"INVALID_CREDENTIALS"
        }
    })}

    const {email,password,name} = validate.data;

    try {
        
    const hashed =await bcrypt.hash(password,5)


    const exist =await prismaclient.user.findFirst({
        where:{
            email:email
        }
    })
    if(exist){return res.status(400).json({
        error:{
            code:"EMAIL_ALREADY_EXIST"
        }
    })}

    const user =await prismaclient.user.create({
        data:{
            email:email,
            password:hashed,
            name:name
        }
    })

    if(user){return res.status(200).json({msg:"user created successfully"})}


    }catch(err){return res.status(400).json({
        error:{
            code:"VALIDATION_FALIED"
        },err
    })}



    
})

userrouter.post("/signin",async (req,res)=>{
    const {email , password} = req.body;

    const validate = signinSchema.safeParse(req.body)
    if(!validate.success){return res.status(401).json({
        error:{
            code:"INVALID_CREDENTIALS"
        }
    })}

    const exist =await prismaclient.user.findFirst({
        where:{
           email
        }
    })
    if(!exist){return res.status(401).json({
        error:{
            code:"INVALID_CREDENTIALS"
        }
    })}

    const match =await  bcrypt.compare(password,exist.password)

    if(!match) {return res.status(401).json({
        error:{
            code:"INVALID_CREDENTIALS"
        }
    })}

    const token = jwt.sign({userId:exist.id},JWT_SECRET)

    res.status(200).json({token:token})

  
})

userrouter.post("/create-room",user_auth,async (req,res)=>{


    const {roomname} = req.body;
    
    try {

         //@ts-ignore
            const admin = req.id,  // haev to do augmentation (Request property of express need to be augmented , will do i f )
    
         if(!admin){return res.status(400).json({
            error:{
                code:"UNAUTHORIZED"
            }
         })}
     

      const roomExist = await prismaclient.rooms.findFirst({
            where: { roomname: roomname }
        });

        if (roomExist) {
            console.log("Room already exists!");
            return res.status(400).json({
                error: { code: "ROOM_NAME_EXIST" }
            });
        }

        
    const create = await prismaclient.rooms.create({
        data:{
           
            roomname:roomname,
            admin:admin
        }
    })

    if(create){
       return res.status(200).json({msg:create.id})
    }
    
    

    } catch (err) {
    
        return res.status(401).json({
        
        error:{
            code:"FAILED_TO_CREATE_A_ROOM"
        }
    })}


})