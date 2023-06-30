import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import WelcomePage from "./components/pages/WelcomePage";
import Dashboard from "./components/pages/HomePage";
import Discover from "./components/pages/DiscoverPage";
import UploadPage from "./components/pages/UploadPage";
import Post from "./components/pages/PostPage";
import Update from "./components/pages/UpdatePage";
import MyPosts from "./components/pages/MyPosts";
import SavedPosts from "./components/pages/SavedPosts";
function App() {
  return (
    <div className="app-root bg-dark p-0 m-0" style={{ height: "100%" }}>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/dashboard/post/:postId" element={<Post />} />
          <Route path="/dashboard/post/update/:id" exact element={<Update />} />
          <Route path="/dashboard/myposts" exact element={<MyPosts />} />
          <Route path="/dashboard/savedposts" exact element={<SavedPosts />} />
          <Route path="/dashboard/discover" exact element={<Discover />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/dashboard/upload" element={<UploadPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
