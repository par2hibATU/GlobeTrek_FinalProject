import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utills/error.js";


export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;  
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        
        // Ensure the Hotel document gets updated properly
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $push: { rooms: savedRoom._id } },  
            { new: true, useFindAndModify: false }  
        );

        if (!updatedHotel) {
            return next(createError(404, "Hotel not found"));
        }

        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
};


export const updateRoom = async(req, res, next)=>{
    try{
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body}, 
            { new: true });
        res.status(200).json(updatedRoom)
    }catch(err){
        next(err);
    }
        
}

export const deleteRoom = async(req, res, next)=>{
    const hotelId = req.params.hotelId;  

    try{
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if(!deletedRoom){
            return next(createError(404, "Room not found!"));
        }
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $pull: { rooms: req.params.id }},
            { new: true }  
        );

        if (!updatedHotel){
            return next(createError(404, "Hotel not Found!"));
        }
 
        res.status(200).json("This Room has been deleted")
    }catch(err){
        next(err);
    }
        
}

export const getRoom = async(req, res, next)=>{
    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json(room)
    }catch(err){
        next(err);
    }
        
}

export const getAllRooms = async(req, res, next)=>{
    try{
        const rooms = await Room.find();
        res.status(200).json(rooms)
    }catch(err){
        next(err);
    }
        
}