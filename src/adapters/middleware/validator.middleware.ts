import { Request,Response,NextFunction } from "express";
import { AnySchema } from "yup";
import HttpStatusCode from "../../domain/enum/httpstatus";

export const validateSchema=(schema:AnySchema)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await schema.validate(req.body,{abortEarly:false})
            .then(() => next())
            .catch(err => res.status(HttpStatusCode.BAD_REQUEST).json({ errors: err.errors }));
        } catch (error) {
            const err=error as Error
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err:err.message})
            return
            
        }
    }
}