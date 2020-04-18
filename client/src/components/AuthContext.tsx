import React, { Component } from "react";
import apiUrl from "../common/apiurl.js";
import postOrPutData from "../common/postOrPutData.js";
import isLoggedIn from "../common/isLoggedIn";

const AuthContext = React.createContext<{
  loggedIn?: boolean;
  logout?: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastAuthMessage?: string;
}>({});

interface AuthProviderState {
  [index: string]: string | boolean;
  email: string;
  password: string;
  loggedIn: boolean;
  lastAuthMessage: string;
}

class AuthProvider extends Component {
  state: AuthProviderState = {
    email: "",
    password: "",
    loggedIn: isLoggedIn(),
    lastAuthMessage: "",
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newState = { ...this.state };
    newState[name] = value;
    this.setState(newState);
  };

  logout = async () => {
    console.log("logout pressed", this);
    try {
      const token = localStorage.getItem(apiUrl() + "token");
      localStorage.removeItem(apiUrl() + "token");
      const logoutUrl = `${apiUrl()}/auth/logout`;
      console.log(logoutUrl);
      await postOrPutData(logoutUrl, { token });
      this.setState({ loggedIn: false, lastAuthMessage: "" });
    } catch (err) {
      console.log("Problem logging out", err);
    }
  };
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    postOrPutData(`${apiUrl()}/auth/signin`, this.state, "POST")
      .then((data) => {
        console.log(data.message);
        if (data.success) {
          window.localStorage.setItem(apiUrl() + "token", data.token);
          this.setState({ loggedIn: true, lastAuthMessage: data.message });
        } else {
          window.localStorage.removeItem(apiUrl() + "token");
          this.setState({ loggedIn: false, lastAuthMessage: data.message });
        }
      })
      .catch((err) => {
        console.log(err.stack);
      });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          loggedIn: this.state.loggedIn,
          onSubmit: this.onSubmit,
          logout: this.logout,
          onChange: this.onChange,
          lastAuthMessage: this.state.lastAuthMessage,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
