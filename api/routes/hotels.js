import express from "express"
import Hotel from "../models/Hotel.js";
import createError from "http-errors";
import { countByCity, createHotel, deleteHotel, getAllHotels, getHotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utills/verifyToken.js";
 


const router = express.Router();

// create 
router.post("/", verifyAdmin, createHotel);


//update
router.put("/:id", verifyAdmin, updateHotel)

//delete
router.delete("/:id", verifyAdmin, deleteHotel)

//get
router.get("/find/:id", getHotel)


//get all
router.get("/", getAllHotels)

router.get("/countByCity", countByCity)
router.get("/countByType", getAllHotels)


export default router