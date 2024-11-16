import store from "./store"; // Adjust the path as needed
import { setPosts } from "./postSlice";

// Dispatch an action to test the postSlice
store.dispatch(setPosts([{ id: 1, title: "Test Post" }]));

// Log the current state
console.log("Store State:", store.getState());
