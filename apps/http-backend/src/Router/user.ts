
import express from "express"
import { Router } from "express";

import bcrypt from "bcrypt"
import { user_auth } from "../middleware/user_middleware";

import { createUserSchema , signinSchema} from "@repo/common/zodschema"

 
export const userrouter:Router =  Router();

userrouter.use(express.json());

userrouter.post("/signup",async (req,res)=>{

    const {email,password} = req.body;

 

    const validate = createUserSchema.safeParse(req.body)
    if(!validate.success){return res.status(400).json({
        error:{
            code:"INVALID_CREDENTIALS"
        }
    })}

    const hashed = bcrypt.hash(password,5)




    // make a db call see if usernaem is already taken if taken return 

    // now add user to db 

    
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