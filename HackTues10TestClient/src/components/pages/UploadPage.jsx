import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./background.css";
import { CircularProgress, Box } from "@mui/material";

const Upload = () => {
  const [user, setUser] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("listed");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
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
            setLoading(false);
            navigate("/auth/login");
          }
          setUser(res.data.user);
          setLoading(false);
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

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("photo", photo);
    formData.append("user", JSON.stringify(user));
    console.log(user);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    axios
      .post(
        "https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/upload/",
        formData,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div className="gradient-background">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        style={{
          padding: 10,
          zIndex: 999,
        }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>

            <Nav.Link onClick={() => navigate("/dashboard/discover")}>
              Discover Posts
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard/savedposts")}>
              Saved Posts
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard/myposts")}>
              My Posts
            </Nav.Link>
            <Navbar.Brand onClick={() => navigate("/dashboard/upload")}>
              Add Post
            </Navbar.Brand>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="content">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh">
            <CircularProgress size={100} />
          </Box>
        ) : (
          <Container
            className="d-flex flex-column align-items-center justify-content-center text-white"
            style={{
              background: "#242944",
              borderRadius: 10,
              padding: "10%",
              margin: 0,
              width: "100%",
              zIndex: 0,
            }}>
            <h2>Upload Image</h2>
            <Form
              onSubmit={onSubmit}
              className="w-100"
              encType="multipart/form-data">
              <Form.Group controlId="formCaption">
                <Form.Label>Caption:</Form.Label>
                <Form.Control
                  type="text"
                  name="caption"
                  required
                  className="mb-3 p-3 bg-secondary text-white"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  required
                  className="mb-3 p-3 bg-secondary text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formVisibility">
                <Form.Label>Visibility:</Form.Label>
                <Form.Control
                  as="select"
                  name="visibility"
                  required
                  className="mb-3 p-3 bg-secondary text-white"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}>
                  <option value="listed">Listed</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Upload an Image:(only if you want to update the image)
                </Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  required
                  className="mb-3 p-3 bg-secondary text-white"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  accept=".jpg, .jpeg, .png, .gif"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 p-2">
                Upload
              </Button>
            </Form>
            <a href="/dashboard/" className="mt-3 text-primary">
              Back
            </a>
          </Container>
        )}
      </div>
    </div>
  );
};

export default Upload;
