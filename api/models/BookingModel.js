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
  roomNumbers: {
    type: [String],
    required: true,
  },
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
