import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { TokenAndCookie } from "../utils/jwt.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../model/post.model.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ code: 0, msg: "Please provide all required fields" });
    }
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return res.status(400).json({ code: 0, msg: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res
      .status(201)
      .json({ code: 1, msg: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ code: 0, msg: "Please provide email and password" });
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ code: 0, msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 0, msg: "Invalid email or password" });
    }

    const userId = user._id;

    await TokenAndCookie(userId, res); 
    
    const populatePosts = (await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.toString() === userId.toString()) {
          return post;
        }
        return null;
      })
      )).filter(post => post !== null);
      
      user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        gender: user.gender,
        followers: user.followers,
        following: user.following,
        posts: populatePosts,
        bookmarks: user.bookmarks,
      };
      
      return res.status(200).json({ code: 1, msg: "User logged in successfully", user: user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 0, msg: "Server error while logging in user" });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("fuckGram");
    return res
      .status(200)
      .json({ code: 1, msg: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while logging out user" });
  }
};

export const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ code: 0, msg: "Please provide user id" });
    }
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ code: 0, msg: "User not found" });
    }
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmarks: user.bookmarks,
    };
    return res.status(200).json({ code: 1, msg: "profile fetched!!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while fetching user profile" });
  }
};
export const editProfile = async (req, res) => {
  const userId = req.user._id;
  const { bio, gender } = req.body;
  const profilePic = req.file;
  try {
    let cloudResponse;
    if (profilePic) {
      const fileUri = getDataUri(profilePic);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    console.log("Editing profile for user ID:", userId);
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ code: 0, msg: "User not found" });
    }

    if (bio && gender) {
      user.bio = bio;
      user.gender = gender;
    }
    if (profilePic) {
      user.profilePic = cloudResponse.secure_url;
    }

    await user.save();
    return res.status(200).json({ code: 1, msg: "Profile updated", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "Server error while editing user profile" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const suggestedUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    return res
      .status(200)
      .json({ code: 1, msg: "suggested users fetched", users: suggestedUsers });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, msg: "error in get suggested users" });
  }
};

export const followOrUnfollow = async (req, res) => {
  const followKarneWala = req.user._id;
  const userToFollow = req.params.id;
  try {
    if (userToFollow === followKarneWala.toString()) {
      return res.status(400).json({ code: 0, msg: "Cannot follow yourself" });
    }

    const user = await User.findById(followKarneWala);
    const user2 = await User.findById(userToFollow);

    if (!user || !user2) {
      return res.status(404).json({ code: 0, msg: "User not found" });
    }

    if (user2.followers.includes(followKarneWala)) {
      user2.followers.pull(followKarneWala);
      user.following.pull(userToFollow);
      await user.save();
      await user2.save();
      return res
        .status(200)
        .json({ code: 1, msg: "User unfollowed successfully" });
    } else {
      user2.followers.push(followKarneWala);
      user.following.push(userToFollow);
      await user.save();
      await user2.save();
      return res
        .status(200)
        .json({ code: 1, msg: "User followed successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      msg: "Server error while following or unfollowing user",
    });
  }
};
