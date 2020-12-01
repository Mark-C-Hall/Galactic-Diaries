import React, { Component } from "react";
import axios from "axios";

export class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const req = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };

    axios.post("/api/auth/register", req).then((res) => {
      console.log(res);
      window.location = "/home";
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div id="signup">
        <form id="signup-form" onSubmit={this.handleSubmit}>
          <div id="signup-name">
            <label for="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={this.handleChange}
            ></input>
          </div>
          <div id="signup-email">
            <label for="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={this.handleChange}
            ></input>
          </div>
          <div id="signup-pass">
            <label for="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={this.handleChange}
            ></input>
          </div>
          <div id="signup-submit">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Signup;
