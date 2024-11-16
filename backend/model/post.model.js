import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caption: { type: String, default: "" },
  image: { type: String, required: true },
  author: {type:mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;
