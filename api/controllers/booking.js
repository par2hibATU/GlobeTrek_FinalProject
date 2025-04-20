router.get("/user/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate("hotelId")
      .populate({
        path: "roomNumbers",
        model: "Room", 
        select: "roomNumbers.number", 
      });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});
