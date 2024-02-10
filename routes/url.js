const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // kyoki hum user ki id le rhe hai to user ka reference lena hai
    },
    shortId: {
      type: String,
      required: true,
      // unique: true,
    },
    redirectURL: {
      type: String,
      // required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
