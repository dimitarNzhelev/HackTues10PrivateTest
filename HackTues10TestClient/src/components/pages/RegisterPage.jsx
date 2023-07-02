import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterComponent = ({ errors, messages }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    let isMounted = true;

    axios
      .get("https://lobster-app-2-2vuam.ondigitalocean.app/dashboard/", {
        withCredentials: true,
      })
      .then((res) => {
        if (isMounted) {
          if (res.data.user === null) {
          } else {
            navigate("/dashboard");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const urlWithProxy =
      "https://lobster-app-2-2vuam.ondigitalocean.app/auth/register";

    const data = {
      name,
      email,
      password,
      confirmPassword,
    };

    axios
      .post(urlWithProxy, data, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          if (res.data.errors) {
            console.log(res.data.errors);
            const errors = res.data.errors.map((err) => err.msg).join("\n");
            alert(errors);
          } else {
            alert(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          const errorMessages = err.response.data.errors
            .map((error) => error.msg)
            .join("\n");
          alert(errorMessages);
        } else if (err.request) {
          alert("Request was made but no response was received");
        } else {
          alert("Something went wrong");
        }
      });
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 py-3 text-white">
      <h1 className="mb-5">Register</h1>

      <Form onSubmit={onSubmit} className="w-50">
        <Form.Group controlId="formName">
          <Form.Control
            type="text"
            name="name"
            placeholder="Name"
            required
            className="mb-3 p-3 bg-secondary text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            required
            className="mb-3 p-3 bg-secondary text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            required
            className="mb-3 p-3 bg-secondary text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Control
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="mb-3 p-3 bg-secondary text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 p-2">
          Register
        </Button>
        <Form.Text className="text-light mt-3">
          Already have an account?
          <a href="/auth/login" className="text-primary">
            Login
          </a>
        </Form.Text>
      </Form>
    </Container>
  );
};

export default RegisterComponent;
