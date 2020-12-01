import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export class Settings extends Component {
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
    };

    axios.put("/api/auth/me", req).then((res) => {
      console.log(res);
      window.location = "/home";
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div id="settings">
        <form id="settings-form" onSubmit={this.handleSubmit}>
          <div id="settings-name">
            <label for="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={this.handleChange}
            ></input>
          </div>
          <div id="settings-email">
            <label for="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={this.handleChange}
            ></input>
          </div>
          <div id="settings-submit">
            <button type="submit">Change User information</button>
          </div>
        </form>
        <Link to="/changePassword">Change Password</Link>
      </div>
    );
  }
}

export default Settings;
