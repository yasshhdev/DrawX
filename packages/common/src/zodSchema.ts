import z from "zod"



export const createUserSchema= z.object({
       username:z.string().min(3).max(50),
       password:z.string().min(3).max(50) ,
       name:z.string().max(30)
})

export const signinSchema = z.object({
   username:z.string().min(3).max(50),
   password:z.string().min(3).max(50)
})

export const roomIdValidation = z.object({

    roomId:z.string().length(15) 
})

