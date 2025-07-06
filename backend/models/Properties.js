const mongoose = require("mongoose");

// const PropertySchema = new mongoose.Schema(
//   {
//     seller: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
//     title: { type: String, required: true },
//     description: { type: String, required: false },
//     status: { type: String, enum: ["Pending", "Approved","Rejected","OnSell","Selled"], required: true },
//     startingBid: { type: Number, required: false },
//     startBiddingTime: { type: Date, required: false },
//     endBiddingTime: { type: Date, required: false },
//     images: [{ type: String }],
//   },
//   { timestamps: true }
// );
const propertySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    noOfBathroom: {
      type: Number,
      required: true,
    },
    noOfBedroom: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    soldPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "On Sale", "Sold"],
      default: "Pending",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    startBiddingTime: {
      type: Date,
      required: true,
    },
    endBiddingTime: {
      type: Date,
      required: true,
    },
    images: [{
      type: String,
    }],
  },
  { timestamps: true }
);

const Properties = mongoose.model("Properties", propertySchema);

module.exports = Properties;

