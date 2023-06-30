import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import "./CommentPopup.css";

const CommentPopup = ({ show, handleClose, handleSave }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(commentText);
    setCommentText("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className="bg-dark text-white">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>Add a comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "black" }}>Comment</Form.Label>
            <Form.Control
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-dark text-white"
            />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CommentPopup;
