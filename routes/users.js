const mongoose = require("mongoose");
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/newUrlShortner");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    // unique: true,
  },
  password: {
    type: String,
    // required :true 
  },
  Urls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url', // kyoki hum post ki id le rhe hai to humne post ka reference le rakha hai
    },
  ]
});

userSchema.plugin(plm)

module.exports = mongoose.model("User", userSchema);