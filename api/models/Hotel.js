import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  rooms: {
    type: [String],
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    required: false,
  },

  ratingsCount: { type: Number, default: 0 }, // Number of ratings
  ratingsSum: { type: Number, default: 0 }, // Total sum of all ratings
  comments: [
    {
      user: { type: String }, // Optional: User name or ID
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

HotelSchema.virtual("bayesianRating").get(function () {
  const R = this.ratingsCount ? this.ratingsSum / this.ratingsCount : 0;
  const v = this.ratingsCount;
  const m = 5; // Minimum reviews to be considered trustworthy
  const C = 3.5; // Global average (can be dynamic later)

  const bayesian = (v / (v + m)) * R + (m / (v + m)) * C;
  return bayesian.toFixed(2);
});

HotelSchema.set("toJSON", { virtuals: true }); // Ensure virtual is returned in JSON
HotelSchema.set("toObject", { virtuals: true });

export default mongoose.model("Hotel", HotelSchema);
