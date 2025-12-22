import z, { email } from "zod"



export const createUserSchema= z.object({
       email:z.string().email(),
       password:z.string().min(3).max(50) ,
       name:z.string().max(30)
})

export const signinSchema = z.object({
   email:z.string().email(),
   password:z.string().min(3).max(50)
})

export const roomIdValidation = z.object({

    roomId:z.string().length(15) 
})

