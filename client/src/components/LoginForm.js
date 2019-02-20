'use strict;'
import "./LoginForm.css"
import React, { Component } from "react";
import { Input,Label, Form } from "reactstrap";
import apiUrl from "../common/apiurl.js";
import postOrPutData from  "../common/postOrPutData.js"
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
        }
    }

    onChange = e => {
            const { name, value} = e.target;
            let newState = {...this.state};
            newState[name] = value;
            this.setState( newState );
           
    }      
    onSubmit = e => {
        console.log(this.state);
        postOrPutData(`${apiUrl()}/auth/signin`, this.state,"POST")
        .then( (data) => {
            console.log(data);
            if (data.success) { 
                window.localStorage.setItem(apiUrl() + 'token', data.token);
                console.log(window.localStorage.getItem(apiUrl() + 'token'));
                this.props.app.forceUpdate();
                this.setState({email:'', password: ''});
            }
        })
        .catch((err) => {
            console.log(err.stack);
        });
        e.preventDefault();
    }
         


    render() {
        return(
                <div className="container">
                <h2>Login Here</h2>
                <Form onChange={this.onChange} onSubmit={this.onSubmit}>
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email"  placeholder="Email Address" ></Input>
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="Password"></Input>
                    <Input type="submit" value="Login" />
               </Form>
               </div>
        );
    };

}

export default LoginForm;