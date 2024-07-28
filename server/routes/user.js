const router = require("express").Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");

/* GET TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId");
    res.status(202).json(trips);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Cannot find trips!", error: err.message });
  }
});

/* ADD OR REMOVE LISTING FROM WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId).populate("creator");

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
      await user.save();
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList });
    } else {
      user.wishList.push(listing);
      await user.save();
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList });
    }
  } catch (err) {
    if (err.name === 'VersionError') {
      // Handle the version conflict
      return res.status(409).json({ message: "Conflict occurred while updating. Please try again." });
    }
    console.log(err);
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
