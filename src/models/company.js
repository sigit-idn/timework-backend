const { Schema, model } = require("mongoose");

const Company = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    address: String,
    phone: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = model("Company", Company);
