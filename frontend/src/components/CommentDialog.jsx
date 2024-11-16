import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const inputHandler = (e) => {
    const input = e.target.value;
    if (input.trim()) {
      setText(input);
    } else {
      setText("");
    }
  };

  const addCommentHandler = async () => {
    console.log(text);
  };

  const post = posts.length > 0 ? posts[0] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex outline-none bg-white max-w-4xl rounded-lg overflow-hidden">
        {/* Left Section (Image) */}
        <div className="w-[40%] bg-gray-100">
          {post && (
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right Section (Comments) */}
        <div className="w-[60%] p-4 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <Link>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src={user.profilePic} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link to="/" className="font-semibold hover:underline">
                {user.username}
              </Link>
              <span className="text-xs text-gray-500">{post?.createdAt}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col space-y-3 overflow-y-auto max-h-64 pr-2">
            <div className="flex gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePic} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link to="/" className="font-medium hover:underline">
                  CommenterUsername
                </Link>
                <span className="text-sm">Nice post!</span>
              </div>
            </div>
          </div>

          {/* Add a Comment */}
          <div className="mt-auto pt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={inputHandler}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none"
            />
            <button
              onClick={addCommentHandler}
              className="w-full mt-2 p-2 text-sm bg-slate-500 text-white rounded-xl hover:bg-slate-600"
              disabled={!text.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
