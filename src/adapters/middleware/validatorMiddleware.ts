import { Request,Response,NextFunction } from "express";
import { AnySchema } from "yup";

export const validateSchema=(schema:AnySchema)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await schema.validate(req.body,{abortEarly:false})
            .then(() => next())
            .catch(err => res.status(400).json({ errors: err.errors }));
        } catch (error) {
            const err=error as Error
            res.status(500).json({err:err.message})
            return
            
        }
    }
}