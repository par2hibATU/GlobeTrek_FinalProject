import express from "express"
import Hotel from "../models/Hotel.js";
import createError from "http-errors";
import { createHotel, deleteHotel, getAllHotels, getHotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utills/verifyToken.js";
 


const router = express.Router();

// create 
router.post("/", verifyAdmin, createHotel);


//update
router.put("/:id", verifyAdmin, updateHotel)

//delete
router.delete("/:id", verifyAdmin, deleteHotel)

//get
router.get("/:id", getHotel)


//get all
router.get("/", getAllHotels)
export default router