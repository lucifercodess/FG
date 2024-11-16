import mongoose from "mongoose";

const convoSchema = new mongoose.Schema({
  particpants:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  message:[
    {type: mongoose.Schema.Types.ObjectId,
    ref: "Message"}
  ]
},{timestamps: true});



const Conversation = mongoose.model("Conversation", convoSchema);

export default Conversation;
