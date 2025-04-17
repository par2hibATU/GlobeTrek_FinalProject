import express from "express";
import { createReview, deleteReview, updateReview, getReviewsByHotel, getReviewsByUser } from "../controllers/review.js";
import { verifyUser } from "../utills/verifyToken.js";

const router = express.Router();

// Create review 
router.post("/", verifyUser, createReview);

// Update review 
router.put("/:id", verifyUser, updateReview);

// Delete review
router.delete("/:id", verifyUser, deleteReview);

// Get all reviews for a hotel
router.get("/hotel/:hotelId", getReviewsByHotel);

// Get all reviews by a user
router.get("/user/:userId", getReviewsByUser);

export default router;
