
import express from "express"
import { Router } from "express";
import zod from "zod"
import bcrypt from "bcrypt"
import { user_auth } from "../middleware/user_middleware";

export const userrouter:Router =  Router();

userrouter.use(express.json());

userrouter.post("/signup",async (req,res)=>{
    const {username,password} = req.body;

    const zodschema = zod.object({
        username:zod.string().min(3).max(20),
        password:zod.string().min(3).max(30)
    })

    const validate = zodschema.safeParse(req.body)
    if(!validate.success){return res.status(400).json({msg:"invalid input"})}

    const hashed = bcrypt.hash(password,5)




    // make a db call see if usernaem is already taken if taken return 

    // now add user to db 

    
})

userrouter.post("signin",async (req,res)=>{
    const {username , password} = req.body;

    // make db call to see if user does exist 

    //const hashed =  compare password with the user instence u got from db call 

  
})