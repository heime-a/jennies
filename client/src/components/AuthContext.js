import React from 'react';
import apiUrl from "../common/apiurl.js";
import postOrPutData from "../common/postOrPutData.js";
import isLoggedIn from "../common/isLoggedIn.js"

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
  state = { 
      email: '',
      password: '',
      loggedIn: isLoggedIn()
    }

    onChange = e => {
        console.log('onChange is being called')
        const { name, value } = e.target;
        let newState = { ...this.state };
        newState[name] = value;
        this.setState(newState);

    } 

    onSubmit = e => {
        console.log(this.state)
        postOrPutData(`${apiUrl()}/auth/signin`, this.state,"POST")
        .then( (data) => {
            console.log(data);
            if (data.success) { 
                window.localStorage.setItem(apiUrl() + 'token', data.token);
                console.log(window.localStorage.getItem(apiUrl() + 'token'));
                this.setState({loggedIn: true});
            }
        })
        .catch((err) => {
            console.log(err.stack);
        });
        e.preventDefault();
    }


  logout = () => {
      this.setState({ loggedIn: false })
  }

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
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }