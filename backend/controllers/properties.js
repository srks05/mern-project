const Properties = require("../models/Properties");
const Bids= require("../models/Bids")
const multer = require("multer");
const path = require("path");
const { sendEmail } = require('./auth');
const Users = require("../models/Users"); 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const createProperty = async (req, res) => {
  try {
    const {
      seller,
      type,
      location,
      city,
      province,
      latitude,
      longitude,
      noOfBathroom,
      noOfBedroom,
      size,
      price,
      startBiddingTime,
      endBiddingTime,
      status
    } = req.body;

    if (!seller || !status) {
      return res.status(400).json({ error: "Seller and Status are required fields" });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const newProperty = new Properties({
      seller,
      type,
      location,
      city,
      province,
      latitude,
      longitude,
      noOfBathroom,
      noOfBedroom,
      size,
      price,
     // soldPrice: null,
      status,
      startingBid:price,
      startBiddingTime,
      endBiddingTime,
      images,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllProperties = async (req, res) => {
  try {
    let query = {};
    
    if (!req.query.all) {
      query.status = { $ne: "Pending" };
    }
    const properties = await Properties.find(query).populate("seller", "-password");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPropertiesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const properties = await Properties.find({ seller: userId }).populate("seller", "-password");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
const getPropertyById = async (req, res) => {
  try {
    const property = await Properties.findById(req.params.id).populate("seller", "-password");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateProperty = async (req, res) => {
  try {
    const {
      type,
      location,
      city,
      province,
      latitude,
      longitude,
      noOfBathroom,
      noOfBedroom,
      size,
      price,
      startBiddingTime,
      endBiddingTime,
      status,
      soldPrice
    } = req.body;

    const updatedData = {
      type,
      location,
      city,
      province,
      latitude,
      longitude,
      noOfBathroom,
      noOfBedroom,
      size,
      price,
      //soldPrice,
      status,
      startingBid:price,
      startBiddingTime,
      endBiddingTime
    };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    }

    const updatedProperty = await Properties.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const property = await Properties.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { propertyId, newStatus } = req.body;

    if (!propertyId || !newStatus) {
      return res.status(400).json({ error: "Property ID and new status are required" });
    }

    
    let statusToSet = newStatus === 'Approved' ? 'OnSell' : newStatus;

    const validStatuses = ["Pending", "Approved", "Rejected", "OnSell", "Selled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    //get property details by propertyId
    const property = await Properties.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    //get seller details by sellerId
    const seller = await Users.findById(property.seller);
    // if status is Approved then email to all buyers
    if (newStatus === 'Approved') {
      const buyers = await Users.find({ role: 'buyer' });
      for (const buyer of buyers) {
        await sendEmail({
          to: buyer.email,
          subject: 'New auction started on Property',
          text: `A new property is available: ${property.title}. Location: ${property.location}. Price: ${property.price}.`,
          html: `<h3>New Property Auction</h3><p><b>Title:</b> ${property.title}</p><p><b>Location:</b> ${property.location}</p><p><b>Price:</b> ${property.price}</p>`
        });
      }
    }

    const updatedProperty = await Properties.findByIdAndUpdate(
      propertyId,
      { status: statusToSet },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateBid = async (req, res) => {
  try {
    const { bidId, isPaid } = req.body;
    const bid = await Bids.findByIdAndUpdate(
      bidId,
      { isPaid },
      { new: true }
    );
    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateStatus,
  upload,
  getAllPropertiesByUserId,
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updateBid,
};
