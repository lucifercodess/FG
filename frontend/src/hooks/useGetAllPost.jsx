import { setPosts } from "@/store/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/post/all-posts", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (data.code === 1) {
          console.log("Dispatching setPosts:", data.posts); // Log the posts data
          dispatch(setPosts(data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPosts();
  }, []);
};

export default useGetAllPosts;
