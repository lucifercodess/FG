import mongoose from "mongoose";

const messageSchema =  new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},{timestamps: true})


const Message = mongoose.model("Message", messageSchema);

export default Message;