import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByHotel,

} from "../controllers/reviews.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utills/verifyToken.js";

const router = express.Router();

// Create a review (user must be logged in)
router.post("/:hotelId", verifyToken, createReview);

// Update a review (only the user or admin)
router.put("/:id", verifyToken, updateReview);

// Delete a review (only the user or admin)
router.delete("/:id", verifyToken, deleteReview);

// Get all reviews for a hotel
router.get("/hotel/:hotelId", getReviewsByHotel);



export default router;
