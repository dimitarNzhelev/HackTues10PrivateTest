import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 py-3 bg-dark text-white">
      <h1 className="mb-5">Welcome</h1>

      <Button
        variant="primary"
        className="mb-3 w-50 p-2"
        as={Link}
        to="/auth/login">
        Login
      </Button>

      <Button
        variant="primary"
        className="w-50 p-2"
        as={Link}
        to="/auth/register">
        Register
      </Button>
    </Container>
  );
};

export default Home;
