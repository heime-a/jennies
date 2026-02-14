import "./LoginForm.css";
import React from "react";
import { Input, Form, Button, Alert } from "reactstrap";
import { AuthContext } from "./AuthContext";
import jenniesLogo from "../assets/jennies.jpg";

const LoginForm = () => {
  return (
    <div className="login-wrapper">
      <AuthContext.Consumer>
        {({ loggedIn, onSubmit, onChange, lastAuthMessage }) => (
          <>
            {loggedIn || (
              <>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <img src={jenniesLogo} alt="Jennies Logo" style={{ maxHeight: "60px" }} />
                </div>
                <h3>Sign In</h3>
                <Form onSubmit={onSubmit}>
                  <Input
                    onChange={onChange}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                  ></Input>
                  <Input
                    onChange={onChange}
                    name="password"
                    type="password"
                    placeholder="Password"
                  ></Input>
                  <Button type="submit">Sign In</Button>
                </Form>
              </>
            )}
            {lastAuthMessage && (
              <Alert
                color={lastAuthMessage.toUpperCase().includes("ERROR:") ? "danger" : "info"}
              >
                {lastAuthMessage}
              </Alert>
            )}
          </>
        )}
      </AuthContext.Consumer>
    </div>
  );
};

export default LoginForm;
