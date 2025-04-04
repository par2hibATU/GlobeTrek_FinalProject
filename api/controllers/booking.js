router.get("/user/:userId", async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.params.userId }).populate("hotelId");
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  