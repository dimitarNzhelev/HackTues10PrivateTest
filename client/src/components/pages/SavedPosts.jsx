import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CircularProgress, Box } from "@mui/material";
import "./card.css";
import "./background.css";

const SavedPosts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    axios
      .get("https://lobster-app-2-2vuam.ondigitalocean.app/auth/logout", {
        withCredentials: true,
      })
      .then((res) => {
        setUser();
        navigate("/auth/login");
      });
  };
  axios.defaults.withCredentials = true;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get("https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/", {
        withCredentials: true,
      })
      .then((res) => {
        if (isMounted) {
          if (res.data.user === null) {
            setLoading(true);
            navigate("/auth/login");
          }

          setUser(res.data.user);
          if (isMounted) {
            axios
              .get(
                "https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/save/",
                { withCredentials: true }
              )
              .then((res) => {
                setPosts(res.data.posts);
                setLoading(false);
              })
              .catch((err) => {
                console.error(err);
                setLoading(false);
              });
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err);
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="gradient-background">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        style={{
          padding: 10,
        }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>

            <Nav.Link onClick={() => navigate("/dashboard/discover")}>
              Discover Posts
            </Nav.Link>
            <Navbar.Brand onClick={() => navigate("/dashboard/savedposts")}>
              Saved Posts
            </Navbar.Brand>
            <Nav.Link onClick={() => navigate("/dashboard/myposts")}>
              My Posts
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard/upload")}>
              Add Post
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div
        className="only-gradient"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "start",
        }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh">
            <CircularProgress size={100} />
          </Box>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => {
            return (
              <Card className="cardHover" key={post.id}>
                <CardActionArea
                  onClick={() =>
                    navigate("/dashboard/post/" + post.id, { state: { post } })
                  }>
                  <CardMedia
                    component="img"
                    className="image"
                    image={post.imageUrl}
                    alt="green iguana"
                  />
                  <CardContent className="card-content">
                    <Typography gutterBottom variant="h5" component="div">
                      {post.caption}
                    </Typography>

                    <Typography gutterBottom variant="h6" component="div">
                      Author: {post.author}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })
        ) : (
          <h1 style={{ color: "#fff", padding: 20 }}>There are no posts</h1>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
