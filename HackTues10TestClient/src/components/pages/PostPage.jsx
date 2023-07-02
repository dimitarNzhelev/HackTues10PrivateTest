import React from "react";
import { useLocation } from "react-router-dom";
import "./background.css";
import useWindowSize from "./helperFunction";
import LargeScreenPostPage from "./LargeScreenPostPage";
import SmallScreenPostPage from "./SmallScreenPostPage";
const PostPage = () => {
  const location = useLocation();
  const post = location.state.post;

  // naistina sujalqvam ako chetesh tozi kod. My eyes hurt :P

  const size = useWindowSize();
  console.log(size);

  return (
    <div className="gradient-background">
      {size.width > 768 ? <LargeScreenPostPage /> : <SmallScreenPostPage />}
    </div>
  );
};
export default PostPage;
