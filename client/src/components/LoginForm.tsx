"use strict;";
import "./LoginForm.css";
import React from "react";
import { Input, Form, Button } from "reactstrap";
import { AuthConsumer } from "./AuthContext";

const LoginForm = () => {
  return (
    <div className="login-wrapper">
      <AuthConsumer>
        {({ loggedIn, onSubmit, onChange }) => (
          <>
            {loggedIn || (
              <>
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
          </>
        )}
      </AuthConsumer>
    </div>
  );
};

export default LoginForm;
