const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Properties", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Number, required: false },
    timestamp: { type: Date, default: Date.now },
  }
);

const Bids = mongoose.model("Bids", BidSchema);

module.exports = Bids;