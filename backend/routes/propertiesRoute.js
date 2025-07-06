const express = require("express");
const { 
  updateStatus,
  upload, 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty, 
  getAllPropertiesByUserId,
  updateBid
} = require("../controllers/properties");
const Bids = require("../models/Bids");

const router = express.Router();

router.post("/", upload.array("images", 5), createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", upload.array("images", 5), updateProperty);
router.delete("/:id", deleteProperty);
router.get("/getAllPropertiesByUserId/:id", getAllPropertiesByUserId);
router.post("/updateStatus", updateStatus);


router.get("/:propertyId/bids", async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bids = await Bids.find({ property: propertyId }).populate("buyer", "username");
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/:propertyId/bids", async (req, res) => {
  try {
    const { amount, buyer, property } = req.body;

    
    if (!amount || !buyer || !property) {
      return res.status(400).json({ error: "Amount, buyer, and property are required" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    
    const newBid = new Bids({
      amount,
      buyer,
      property
    });

    
    const savedBid = await newBid.save();

    // Populate buyer information
    const populatedBid = await Bids.findById(savedBid._id).populate("buyer", "username");

    res.status(201).json(populatedBid);
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ error: error.message || "Error creating bid" });
  }
});


router.post("/bids/update", updateBid);


router.delete('/:propertyId/bids', async (req, res) => {
  try {
    const { propertyId } = req.params;
    await Bids.deleteMany({ property: propertyId });
    res.status(200).json({ message: 'All bids deleted for this property' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to delete bids' });
  }
});

module.exports = router;
