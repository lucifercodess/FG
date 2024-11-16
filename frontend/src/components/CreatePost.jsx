import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { setPosts } from "@/store/postSlice";



const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {posts} = useSelector((store) => store.post)

  const createPostHandler = async (e) => {
    e.preventDefault();
    console.log("Create Post Handler triggered");

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) {
      formData.append("image", file);
    }

    setLoading(true); // Show loading spinner

    try {
      console.log("Sending request to create post...");
      const response = await fetch("http://localhost:4000/api/post/create", {
        method: "POST",
        body: formData,
        credentials: "include", // Ensures cookies are sent with the request
      });

      const data = await response.json();
      console.log(data);
      if (data.code === 1) {
       dispatch(setPosts([...posts,data.post])) 
        toast.success("Post created successfully");
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in creating post");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePreview(dataUrl);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader className="font-bold text-center text-2xl mb-4 text-gray-800">
            Create New Post
          </DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePic} alt="User Profile" />
              <AvatarFallback className="text-lg font-semibold">
                CN
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {user?.username}
              </h1>
              <span className="text-gray-500 text-sm">{user?.bio}</span>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full resize-none h-24 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4 w-full h-full rounded-md overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            </div>
          )}
          <div className="flex items-center justify-between mt-6">
            <input
              type="file"
              ref={imageRef}
              className="hidden"
              onChange={fileChangeHandler}
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Select from Computer
            </Button>
            <Button
              onClick={createPostHandler}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
              disabled={loading} // Disable the button when loading
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1 1 8 8 8 8 0 0 1-8-8z"
                    ></path>
                  </svg>
                  <span>Posting...</span>
                </div>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
