import React, { useState } from "react";
import apiUrl from "../common/apiurl.js";
import postOrPutData from "../common/postOrPutData.js";
import isLoggedIn from "../common/isLoggedIn";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext<{
  loggedIn: boolean;
  logout: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastAuthMessage: string;
}>({
  loggedIn: false,
  logout: () => {},
  onSubmit: () => {},
  onChange: () => {},
  lastAuthMessage: "",
});

interface AuthProviderState {
  [index: string]: string | boolean;
  email: string;
  password: string;
  loggedIn: boolean;
  lastAuthMessage: string;
}
interface AuthProviderProps {}

function AuthProvider(props: any): any {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthProviderState>({
    email: "",
    password: "",
    loggedIn: isLoggedIn(),
    lastAuthMessage: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newState = { ...state };
    newState[name] = value;
    setState(newState);
  };

  const logout = async () => {
    console.log("logout pressed", state);
    try {
      const token = localStorage.getItem(apiUrl() + "token");
      localStorage.removeItem(apiUrl() + "token");
      const logoutUrl = `${apiUrl()}/auth/logout`;
      console.log(logoutUrl);
      await postOrPutData(logoutUrl, { token });
      setState({
        loggedIn: false,
        lastAuthMessage: "",
        email: "",
        password: "",
      });
      navigate("/Login");
    } catch (err) {
      console.log("Problem logging out", err);
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    postOrPutData(`${apiUrl()}/auth/signin`, state, "POST")
      .then((data:any) => {
        console.log(data.message);
        if (data.success) {
          window.localStorage.setItem(apiUrl() + "token", data.token);
          setState({ ...state, loggedIn: true, lastAuthMessage: data.message });
        } else {
          window.localStorage.removeItem(apiUrl() + "token");
          setState({
            ...state,
            loggedIn: false,
            lastAuthMessage: data.message,
          });
        }
      })
      .catch((err: { stack: Object}) => {
        console.log(err.stack);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn: state.loggedIn,
        onSubmit,
        logout,
        onChange,
        lastAuthMessage: state.lastAuthMessage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const AuthConsumer = AuthContext.Consumer;

export default AuthProvider;
