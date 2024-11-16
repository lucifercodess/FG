import React, { useState } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import CreatePost from "./CreatePost";


const LeftSidebar = () => {
  
  const [open,setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.auth)
  const sidebarItem = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePic} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Log Out" },
  ]
  // Logout handler
  const logoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/user/logout", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.code === 1) {
        dispatch(setAuthUser(null))
        toast.success(data.msg);
        navigate("/signin");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging out.");
    }
  };

  const createPostHandler = async () => {
    setOpen(true);
  }
  const sidebarHandler = (text) => {
    if (text === "Log Out") {
      logoutHandler();
    }else if(text  === 'Create'){
      createPostHandler();
    }
  };

  return (
    <div className="w-64 h-screen fixed p-4 space-y-4">
      {/* Sidebar Header */}
      <div className="text-2xl font-semibold mb-6">fuckgram</div>

      {/* Sidebar Items */}
      <div className="space-y-4">
        {sidebarItem.map((item) => (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={item.text}
            className="flex items-center space-x-4 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300 cursor-pointer"
          >
            <div className="text-xl">{item.icon}</div>
            <div className="text-lg">{item.text}</div>
          </div>
        ))}
      </div>
      <CreatePost open = {open} setOpen = {setOpen}/>
    </div>
  );
};

export default LeftSidebar;
