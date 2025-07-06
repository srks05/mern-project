const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Seller","Buyer",], required: true }
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);
module.exports=Users
