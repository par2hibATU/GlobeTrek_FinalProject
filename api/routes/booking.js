import express from "express";
import Booking from "../models/BookingModel.js";

const router = express.Router();

//New booking
router.post("/", async (req, res) => {
    const newBooking = new Booking(req.body);
    
    try {
        const savedBooking = await newBooking.save();
        res.status(200).json(savedBooking);
    } catch (err) {
        res.status(500).json(err);
    }
});


//Fetch Previous booking
router.get("/user/:id", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.id }).populate("hotelId");
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;