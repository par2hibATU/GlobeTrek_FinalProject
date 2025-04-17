router.get("/user/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate("hotelId")
      .populate({
        path: "roomNumbers",
        model: "Room", // populate from Room model
        select: "roomNumbers.number", // select only the actual numbers
      });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});
