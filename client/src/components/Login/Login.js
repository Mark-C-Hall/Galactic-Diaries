import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const req = {
      email: this.state.email,
      password: this.state.password,
    };

    axios.post("/api/auth/login", req).then((res) => {
      window.location = "/home";
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div id="login">
        <form id="login-form" onSubmit={this.handleSubmit}>
          <div id="login-user">
            <label>
              Email
              <input
                type="text"
                id="email"
                name="email"
                onChange={this.handleChange}
              ></input>
            </label>
          </div>
          <div id="login-pass">
            <label>
              Password
              <input
                type="password"
                id="password"
                name="password"
                onChange={this.handleChange}
              ></input>
            </label>
          </div>
          <div id="login-submit">
            <button type="submit">Log In</button>
          </div>
        </form>
        <div id="signup">
          <p>Don't have an account?</p>
          <p>
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
        <div id="forgot-password">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </div>
      </div>
    );
  }
}

export default Login;
