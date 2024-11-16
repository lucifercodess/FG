import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setPosts } from "@/store/postSlice";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);  // Getting logged-in user from Redux store
  const { posts } = useSelector((store) => store.post);  // Getting posts from Redux store
  const [like, setLike] = useState(post?.likes.includes(user?._id));  // Check if current user liked the post
  const [postLike, setPostLike] = useState(post?.likes.length);  // Post like count
  const [toggleOpen, setToggleOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState(post.comments);
  const dispatch = useDispatch();

  // Effect to update like status and like count whenever the user or post.likes changes
  useEffect(() => {
    setLike(post?.likes.includes(user?._id));  // Recalculate if current user liked the post
    setPostLike(post?.likes.length);  // Update like count
  }, [user, post.likes]);  // Run when either user or post.likes changes

  // Like/Dislike logic
  const likeDislike = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/post/like-unlike/${post?._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.code === 1) {
        const updatedLikes = like ? postLike - 1 : postLike + 1;  // Update like count based on action
        setPostLike(updatedLikes);
        setLike((prev) => !prev);  // Toggle like state
        toast.success(data.msg);  // Show success toast
      } else {
        toast.error(data.msg);  // Show error toast if request fails
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error in likeDislike:", error);
    }
  };

  const commentHandler = async()=>{
    try {
      const response = await fetch(
        `http://localhost:4000/api/post/add-comment/${post?._id}`,
        {
          headers: { 'Content-Type': 'application/json'},
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ comment: commentText }),
        }
      );
      const data = await response.json();
      if (data.code === 1) {
        const updatedPosts = posts.map((p) =>
          p._id === post?._id? {...p, comments: [...p.comments, data.comment] } : p
        );
        dispatch(setPosts(updatedPosts));  
        setCommentText(""); 
        toast.success(data.msg); 
      }
      else{
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to comment.");
    }
  }
  // Delete post logic
  const deletePost = async () => {
    try {
      setToggleOpen(false);
      const response = await fetch(
        `http://localhost:4000/api/post/delete/${post?._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.code === 1) {
        const updatedPosts = posts.filter((p) => p?._id !== post?._id);
        dispatch(setPosts(updatedPosts));  // Update posts in Redux
        toast.success(data.msg);
        window.location.reload();  // Reload the page to reflect changes
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error("Failed to delete post.");
      console.error(error);
    }
  };

  return (
    <div className="my-4 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.author.profilePic}
              alt={post.author.username}
            />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold">{post.author.username}</h1>
        </div>
        <MoreHorizontal
          onClick={() => setToggleOpen((prev) => !prev)}
          className="cursor-pointer text-gray-600 hover:text-black transition duration-200"
        />
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.image}
          alt="Post image"
          className="w-full object-cover rounded-lg"
        />
      </div>

      {/* Actions & Likes */}
      <div className="flex items-center justify-between px-4 mt-4">
        <div className="flex gap-3">
          {like ? (
            <FaHeart
              onClick={likeDislike}
              className="w-6 h-6 text-red-600 cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeDislike}
              className="w-6 h-6 cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="w-6 h-6 text-gray-600 cursor-pointer hover:text-black"
          />
          <Send className="w-6 h-6 text-gray-600 cursor-pointer hover:text-black" />
        </div>
        <Bookmark className="w-6 h-6 text-gray-600 cursor-pointer hover:text-black" />
      </div>

      {/* Likes & Caption */}
      <div className="px-4 py-2">
        <span className="font-light">{postLike} likes</span>
        <p className="text-sm">
          <span className="font-medium">{post.author.username}</span>{" "}
          {post.caption}
        </p>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4">
        <span
          className="text-sm text-gray-600 cursor-pointer hover:underline"
          onClick={() => setOpen(true)}
        >
          View all comments
        </span>
      </div>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Options Dialog */}
      {toggleOpen && (
        <Dialog open={toggleOpen} onOpenChange={setToggleOpen}>
          <DialogContent className="flex flex-col items-center text-center space-y-2 py-4">
            <Button className="w-full text-sm py-1">Unfollow</Button>
            <Button className="w-full text-sm py-1">Add To Favorites</Button>
            {user?._id === post?.author._id && (
              <Button
                onClick={deletePost}
                className="w-full text-sm py-1 text-red-600"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Post;
