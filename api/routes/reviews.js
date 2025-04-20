import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByHotel,

} from "../controllers/reviews.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utills/verifyToken.js";

const router = express.Router();

// Create a review
router.post("/:hotelId", verifyToken, createReview);

// Update 
router.put("/:id", verifyToken, updateReview);

// Delete 
router.delete("/:id", verifyAdmin, deleteReview);

// Get all
router.get("/hotel/:hotelId", getReviewsByHotel);



export default router;
