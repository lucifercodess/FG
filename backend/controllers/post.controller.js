import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import { getDataUri } from "../utils/dataUri.js"; 

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user._id;

    if (!image || !caption.trim()) {
      return res
        .status(400)
        .json({ code: 0, msg: "Image and caption are required" });
    }

  
    const fileUri = getDataUri(image); 


    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
    });

    const post = new Post({
      user: authorId,
      caption,
      image: cloudResponse.secure_url, // Use the URL from Cloudinary's response
      author: authorId,
    });

    // Save the post and update the user's posts array
    await post.save();
    const user = await User.findById(authorId);
    user.posts.push(post._id);
    await user.save();

    return res
      .status(201)
      .json({ code: 1, msg: "Post created successfully", post });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while creating post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePic",
        },
      });

    return res
      .status(200)
      .json({ code: 1, msg: "All posts fetched", posts: posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while getting all posts" });
  }
};

export const getPostBySpecificUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePic" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePic",
        },
      });
    return res
      .status(200)
      .json({ code: 1, msg: "Posts fetched by specific user", posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      msg: "Server error while getting posts by specific user",
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, msg: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
      return res.status(200).json({ code: 1, msg: "Post unliked", post });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ code: 1, msg: "Post liked", post });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while liking/unliking post" });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({ code: 0, msg: "Comment text is required" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, msg: "Post not found" });
    }
    const comment = new Comment({
      text,
      author: userId,
      post: id,
    });
    await comment.populate({
      path: "author",
      select: "username, profilePic",
    });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    return res
      .status(201)
      .json({ code: 1, msg: "Comment created successfully", comment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while commenting on post" });
  }
};

export const getCommentsOnAPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, msg: "Post not found" });
    }
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePic",
      });
    return res
      .status(200)
      .json({ code: 1, msg: "Comments fetched on a post", comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while getting comments on a post" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, msg: "Post not found" });
    }
    if (userId.toString() !== post.author.toString()) {
      return res
        .status(403)
        .json({ code: 0, msg: "You are not allowed to delete this post" });
    }
    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { posts: id } });
    await Comment.deleteMany({ post: id });
    return res
      .status(200)
      .json({ code: 1, msg: "Post deleted successfully", post });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while deleting post" });
  }
};

export const bookmarkPost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, msg: "Post not found" });
    }
    const user = await User.findById(userId);
    if (user.bookmarks.includes(id)) {
      user.bookmarks.pull(id);
      await user.save();
      return res.status(200).json({ code: 1, msg: "Post unbookmarked", post });
    } else {
      user.bookmarks.push(id);
      await user.save();
      return res.status(200).json({ code: 1, msg: "Post bookmarked", post });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "error while bookmarking post" });
  }
};
