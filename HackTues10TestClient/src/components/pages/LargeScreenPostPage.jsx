import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Form, Image, Button } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./post.css";
import CommentPopup from "../CommentPopUp";
import "./background.css";
import { CircularProgress, Box, Hidden } from "@mui/material";
import useWindowSize from "./helperFunction";
const LargeScreenPostPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const post = location.state.post;
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [likedState, setLikedState] = useState(false);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState();
  const [totalLikes, setTotalLikes] = useState(post.totallikes);
  const [totalComments, setTotalComments] = useState(post.totalcomments);
  const [showPopup, setShowPopup] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [savedState, setSavedState] = useState(false);
  const [loading, setLoading] = useState(false);

  // naistina sujalqvam ako chetesh tozi kod. My eyes hurt :P

  const size = useWindowSize();
  console.log(size);

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
            if (post.visibility === "private") {
              setLoading(false);
              navigate("/auth/login");
            }
          }
          setUser(res.data.user);
          axios
            .get(
              `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/${postId}`,
              { withCredentials: true }
            )
            .then((res) => {
              setComments(res.data.comments);
              setTotalComments(res.data.post.totalcomments);
              setAuthor(res.data.user);
            })
            .catch((err) => {
              console.error(err);
            });

          axios
            .get(
              `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/like/${postId}/status`,
              { withCredentials: true }
            )
            .then((res) => {
              setLikedState(res.data.likeStatus);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err);
        }
      });

    axios
      .get(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/save/${postId}/status`,
        { withCredentials: true }
      )
      .then((res) => {
        setSavedState(res.data.savedStatus);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    setLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/like/${postId}/total`,
        { withCredentials: true }
      )
      .then((response) => {
        setTotalLikes(response.data.totalLikes);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [likedState]);

  async function like() {
    axios
      .get(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/like/${postId}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setLikedState(!likedState);
        }
      })
      .catch((err) => console.log(err));
  }

  async function addComment(commentText) {
    axios
      .post(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${postId}/`,
        {
          postId: postId,
          commentText: commentText,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(
              `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${postId}/`,
              { withCredentials: true }
            )
            .then((res) => {
              setComments(res.data.comments);
              setTotalComments(res.data.totalComments);
              navigate(`/dashboard/post/${postId}`, { state: { post } });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => console.log(err));
  }

  const handleSaveComment = (commentText) => {
    addComment(commentText);
  };

  async function deleteCommentById(id) {
    axios
      .delete(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${id}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(
              `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${postId}/`,
              { withCredentials: true }
            )
            .then((res) => {
              setComments(res.data.comments);
              setTotalComments(res.data.totalComments);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => console.log(err));
  }

  function deletePost() {
    axios
      .delete(
        "https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/myposts/" +
          postId,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/dashboard/discover");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function updateComment(commentId, commentText) {
    axios
      .put(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${commentId}`,
        {
          commentText: commentText,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(
              `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/comments/${postId}/`,
              { withCredentials: true }
            )
            .then((res) => {
              setComments(res.data.comments);
              setTotalComments(res.data.totalComments);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => console.log(err));
  }

  async function save() {
    axios
      .post(
        `https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/posts/save/${postId}`,
        {
          userid: user.id,
          postid: postId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSavedState(!savedState);
        }
      })
      .catch((err) => console.log(err));
  }

  function updatePost(id) {
    navigate("/dashboard/post/update/" + id);
  }

  return post ? (
    <div className="gradient-background" style={{ overflow: "hidden" }}>
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

            <Navbar.Brand onClick={() => navigate("/dashboard/discover")}>
              Discover Posts
            </Navbar.Brand>
            <Nav.Link onClick={() => navigate("/dashboard/savedposts")}>
              Saved Posts
            </Nav.Link>
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
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh">
          <CircularProgress size={100} />
        </Box>
      ) : (
        <div className="split">
          <div className="col-lg-6 col-md-6 col-sm-12 imageContainer">
            <h1 style={{ color: "white", padding: "2%" }}>{post.caption}</h1>
            <Image
              className="post-image "
              src={post.imageUrl}
              alt="Post"
              style={{
                borderRadius: 10,
                width: size.width * 0.625 * 0.8,
                height: size.width * 0.625 * 0.8 * 0.5625,
              }}
            />
            <div
              className="col-lg-6 col-md-6 col-sm-12"
              style={{ width: "100%" }}>
              <div className="container">
                <div
                  style={{
                    alignSelf: "fkex-start",
                    margin: "2%",
                    backgroundColor: "#6774AF",
                    borderRadius: 20,
                  }}>
                  <p style={{ color: "white" }}>Description:</p>
                  <p style={{ color: "white" }}>{post.description}</p>
                  <p style={{ color: "white" }} id="total-likes">
                    Total likes: {totalLikes}
                  </p>
                  <p style={{ color: "white" }} id="totalcomments">
                    Total comments: {totalComments}
                  </p>
                  <p style={{ color: "white" }}>
                    Posted by: {author && author.name}
                  </p>
                  <a href="/dashboard">Back to dashboard</a>
                  {user ? (
                    <>
                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => setShowPopup(true)}>
                        Add comment
                      </Button>

                      <CommentPopup
                        show={showPopup}
                        handleClose={() => {
                          setShowPopup(false);
                        }}
                        handleSave={handleSaveComment}
                      />

                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(post.imageUrl)
                            .then(() => {
                              alert("Image URL copied to clipboard :)");
                            });
                        }}>
                        Share
                      </Button>
                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => like()}>
                        {likedState ? "Unlike" : "Like"}
                      </Button>
                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => save()}>
                        {savedState ? "Unsave" : "Save"}
                      </Button>
                    </>
                  ) : null}

                  {author && user && author.id === user.id && (
                    <>
                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => updatePost(post.id)}>
                        Update Post
                      </Button>
                      <Button
                        className="comment-button"
                        style={{ margin: "2%" }}
                        onClick={() => deletePost()}>
                        Delete Post
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {comments && comments.length > 0 && (
            <div
              className="custom-scrollbar"
              style={{
                height: size.height * 0.92,
                overflowY: "scroll",
                overflowX: "hidden",
                width: size.width * 0.5,
              }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    flex: "1 1 20%",
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: "#6774AF",
                    color: "white",
                    padding: 10,
                    margin: 20,
                  }}>
                  <h1>Comment</h1>
                  <p id={`comment_${comment.id}`}>{comment.comment_text}</p>
                  <p>Posted by: {comment.username}</p>
                  {comment.user_id == user.id && (
                    <>
                      {editCommentId === comment.id ? (
                        <>
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateComment(comment.id, editCommentText);
                              setEditCommentId(null);
                            }}>
                            <Form.Control
                              type="text"
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                            />
                            <Button variant="primary" type="submit">
                              Submit
                            </Button>
                          </Form>
                          <Button onClick={() => setEditCommentId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setEditCommentId(comment.id);
                              setEditCommentText(comment.comment_text);
                            }}
                            style={{ margin: "2%" }}>
                            Update
                          </Button>
                          <Button
                            onClick={() => deleteCommentById(comment.id)}
                            style={{ margin: "2%" }}>
                            Delete
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;
};

export default LargeScreenPostPage;
