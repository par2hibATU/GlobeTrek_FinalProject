import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    if(!token){
        return next(createError(401, "You are not authenticated!"))
    }
    jwt.verify(token, process.env.JWT, (err, user)=>{
        if(err) return next(createError(403, "Token is not Valid!"));
        req.user = user;
        next();

    });
};

export const verifyUser = (req, res, next)=>{
    verifyToken(req, res, (err)=>{
        console.log("req.user.id:", req.user.id);
        console.log("req.params.userId:", req.params.userId);
        if (err) return next(err);

        if(req.user.isAdmin || req.user.id === req.params.id){
            next()
        }else{
            return next(createError(403, "You are not authorized!"));

        }
    })
}

export const verifyAdmin = (req, res, next)=>{
    verifyToken(req, res, (err)=>{
        if (err) return next(err);

        if(req.user.isAdmin ){
            next()
        }else{
            return next(createError(403, "You are not authorized!"));

        }
    })
}


