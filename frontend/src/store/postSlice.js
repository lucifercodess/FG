import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [], // Initial state
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload; // Update posts
    },
  },
});

export const { setPosts } = postSlice.actions; // Export actions
export default postSlice.reducer; // Export reducer
