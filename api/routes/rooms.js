
import express from "express"
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom, updateRoomAvailability } from "../controllers/room.js";
import { verifyAdmin } from "../utills/verifyToken.js";

const router = express.Router();

// create 
router.post("/:hotelId", verifyAdmin, createRoom);


//update
router.put("/:id", verifyAdmin, updateRoom)
// based on availablility
router.put("/availability/:id", updateRoomAvailability)

//delete
router.delete("/:hotelId/:id", verifyAdmin, deleteRoom)

//get
router.get("/:id", getRoom)


//get all
router.get("/", getAllRooms)

export default router