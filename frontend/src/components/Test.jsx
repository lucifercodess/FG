import React, { useEffect } from "react";

import store from "@/store/store";
import { setPosts } from "@/store/postSlice";

const Test = () => {
  useEffect(() => {
    // Test the postSlice
    store.dispatch(setPosts([{ id: 1, title: "Test Post" }]));
    console.log("Store State:", store.getState());
  }, []);

  return <div>Redux Test</div>;
};

export default Test;
