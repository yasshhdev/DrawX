
import express from "express"
import { Router } from "express";

import bcrypt from "bcrypt"
import { user_auth } from "../middleware/user_middleware";
import {prismaclient} from "@repo/db/schema"
import { createUserSchema , signinSchema} from "@repo/common/zodschema"

 
export const userrouter:Router =  Router();

userrouter.use(express.json());

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
        }
    })}



    
})

userrouter.post("signin",async (req,res)=>{
    const {email , password} = req.body;

    const validate = signinSchema.safeParse(req.body)
    if(!validate.success){return res.status(400).json({
        error:{
            code:"Invalid credentials"
        }
    })}

    // make db call to see if user does exist 

    //const hashed =  compare password with the user instence u got from db call 

  
})