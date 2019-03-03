'use strict;'
import "./LoginForm.css"
import React from "react";
import { Input,Label, Form } from "reactstrap";
import { AuthConsumer } from '../AuthContext';

    const LoginForm = () => {
        return(
                <div className="container">
                <AuthConsumer>
                     {({ loggedIn, onSubmit, onChange }) => ( 
                        (<div>
                            {loggedIn ||
                            <>
                            <h2>Login Here</h2>
                            <Form onChange={onChange} onSubmit={onSubmit}>
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" type="email"  placeholder="Email Address" ></Input>
                                <Label htmlFor="password">Password</Label>
                                <Input name="password" type="password" placeholder="Password"></Input>
                                <Input type="submit" value="Login" />
                            </Form>
                            </>
                            }
                        </div>)
                    )}
               </AuthConsumer>
               </div>
        );
    };

export default LoginForm;