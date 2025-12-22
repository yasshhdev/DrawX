import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import {getJwtSecret} from "@repo/backend-common/config"



export function user_auth (req:Request,res:Response,next:NextFunction){

    try{

        const authHeader = req.headers.authentication;

    if(!authHeader) {return res.status(400).json({
        error:{
            code:"HEADER_NOT_PROVIDED"
        }
    })}
    

    if(typeof(authHeader) !== "string" || !authHeader.startsWith("Bearer ")){
        return ({
            error:{
                code:"INVALID_HEADER"
            }
        })
    }
    const token = authHeader.split(" ")[1];
    if(!token){return res.status(400).json({
        error:{
            code:"TOKEN_MISSING"
        }
    })}

    const JWT_SECRET = getJwtSecret();
    

    const verify = jwt.verify(token,JWT_SECRET)

    if(!verify) {return res.status(400).json({
        error:{
            code:"UNAUTHENTICATED_USER"
        }
    })}

    //@ts-ignore
    req.id=verify.userId ;
    next();
    } catch(err) {
        return res.status(409).json({
            error:{
                code:"CONFLICT"
            }
        })
    }
}








































































