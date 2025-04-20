import express from "express";
import Booking from "../models/BookingModel.js";
import Room from "../models/Room.js";

const router = express.Router();

// Create new booking
router.post("/", async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Fetch bookings for user with resolved room numbers
router.get("/user/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id }).populate("hotelId");

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const resolvedRoomNumbers = [];

        for (const subRoomId of booking.roomNumbers) {
          const room = await Room.findOne({ "roomNumbers._id": subRoomId });

          if (room) {
            const foundSubRoom = room.roomNumbers.find(
              (r) => r._id.toString() === subRoomId.toString()
            );
            if (foundSubRoom) {
              resolvedRoomNumbers.push(foundSubRoom.number);
            }
          }
        }

        return {
          ...booking.toObject(),
          resolvedRoomNumbers,
        };
      })
    );

    res.status(200).json(enrichedBookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
