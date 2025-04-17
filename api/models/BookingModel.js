import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  roomNumbers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", // Reference to Room model
    },
  ],
  dates: {
    type: [Date],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Booking", BookingSchema);
