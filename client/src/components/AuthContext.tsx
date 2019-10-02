import React, { Component } from "react";
import apiUrl from "../common/apiurl.js";
import postOrPutData from "../common/postOrPutData.js";
import isLoggedIn from "../common/isLoggedIn";

const AuthContext = React.createContext<{
  loggedIn?: boolean;
  logout?: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>({});

interface AuthProviderState {
  [index: string]: string | boolean;
  email: string;
  password: string;
  loggedIn: boolean;
}

class AuthProvider extends Component {
  state: AuthProviderState = {
    email: "",
    password: "",
    loggedIn: isLoggedIn()
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newState = { ...this.state };
    newState[name] = value;
    this.setState(newState);
  };

  logout = () => {
    console.log(this);
    this.setState({ loggedIn: false });
  };
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(JSON.stringify(this.state));
    console.log(JSON.stringify(e));
    postOrPutData(`${apiUrl()}/auth/signin`, this.state, "POST")
      .then(data => {
        if (data.success) {
          window.localStorage.setItem(apiUrl() + "token", data.token);
          this.setState({ loggedIn: true });
        }
      })
      .catch(err => {
        console.log(err.stack);
      });
    e.preventDefault();
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          loggedIn: this.state.loggedIn,
          onSubmit: this.onSubmit,
          logout: this.logout,
          onChange: this.onChange
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
