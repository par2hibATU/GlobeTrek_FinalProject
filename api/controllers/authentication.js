import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utills/error.js";
import jwt from "jsonwebtoken";

export const register = async(req, res, next)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hash,
            isAdmin:  req.body.isAdmin ?? false,
        })

        await newUser.save()
        res.status(200).send("User has been created. ")
    }catch(err){
        next(err)
    }
}

export const login = async(req, res, next)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user) return next(createError(404, "User not found!"))
        
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordCorrect) return next(createError(400, "Wrong password or Username!"));

        // if password is correct, we gonna create a new token here:
        const token = jwt.sign({id:user._id, isAdmin: user.isAdmin }, process.env.JWT);

        // this will hide the password when login is successful and shows the username and other info which is under user._doc
        const {password, isAdmin, ...otherDetails} = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({...otherDetails});
    }catch(err){
        next(err)
    }
}