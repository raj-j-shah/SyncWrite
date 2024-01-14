const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
  _id:String,
  data: Object,
  owner: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("Document", DocumentSchema);
