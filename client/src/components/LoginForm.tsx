import "./LoginForm.css";
import React, { useContext } from "react";
import { Input, Form, FormGroup, Label, Button, Alert } from "reactstrap";
import { AuthContext } from "./AuthContext";
import jenniesLogo from "../assets/jennies.jpg";

const LoginForm = () => {
  const { loggedIn, onSubmit, onChange, lastAuthMessage } = useContext(AuthContext);

  if (loggedIn) {
    return (
      <div className="login-success-redirect text-center p-5">
        <h4 className="text-success">Successfully Signed In!</h4>
        <p className="text-muted">Redirecting you to the dashboard...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={jenniesLogo} alt="Jennies Logo" className="login-logo" />
          <h3>Welcome Back</h3>
          <p className="text-muted small">Enter your credentials to access the inventory</p>
        </div>
        
        <Form onSubmit={onSubmit} className="login-form">
          <FormGroup>
            <Label for="email" className="small fw-bold">Email Address</Label>
            <Input
              id="email"
              onChange={onChange}
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </FormGroup>
          
          <FormGroup className="mb-4">
            <Label for="password" title="password label" className="small fw-bold">Password</Label>
            <Input
              id="password"
              onChange={onChange}
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </FormGroup>
          
          <Button type="submit" color="primary" className="w-100 py-2">
            Sign In
          </Button>
        </Form>

        {lastAuthMessage && (
          <Alert
            color={lastAuthMessage.toUpperCase().includes("ERROR:") ? "danger" : "info"}
            className="mt-4"
          >
            {lastAuthMessage}
          </Alert>
        )}
      </div>
      
      <div className="login-footer text-center mt-4 small text-muted">
        &copy; 2026 Jennies Inventory System. All rights reserved.
      </div>
    </div>
  );
};

export default LoginForm;
