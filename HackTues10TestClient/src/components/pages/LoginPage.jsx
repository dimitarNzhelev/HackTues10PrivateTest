import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginComponent = ({ errors, messages }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  function onSubmit(e) {
    e.preventDefault();
    const urlWithProxy =
      "https://lobster-app-2-2vuam.ondigitalocean.app/auth/login";

    const data = {
      email: email,
      password: password,
    };

    setLoading(true);

    axios
      .post(urlWithProxy, data, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (res.data.user.isverified) {
          navigate("/dashboard");
        } else {
          console.log("not logged in");
        }
        setLoading(false);
      })
      .catch((err) => {
        alert(err);
        setLoading(false);
      });
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 py-3 text-white">
      <h1 className="mb-5">Login</h1>
      {errors &&
        errors.map((error, index) => (
          <Alert key={index} variant="danger" className="w-50">
            {error.message}
          </Alert>
        ))}

      {messages && messages.success_msg && (
        <Alert variant="success" className="w-50">
          {messages.success_msg}
        </Alert>
      )}

      {messages && messages.error && (
        <Alert variant="danger" className="w-50">
          {messages.error}
        </Alert>
      )}

      <Form onSubmit={onSubmit} className="w-50">
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
        <Button
          variant="primary"
          type="submit"
          className="w-100 p-2"
          disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
        <Form.Text className="text-light mt-3">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-primary">
            Register
          </a>
        </Form.Text>
      </Form>
    </Container>
  );
};

export default LoginComponent;
