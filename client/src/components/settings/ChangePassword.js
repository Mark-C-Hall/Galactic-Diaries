import React, { Component } from "react";
import axios from "axios";

export class ChangePassword extends Component {
  state = {
    newPassword: "",
    currentPassword: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const req = {
      newPassword: this.state.newPassword,
      currentPassword: this.state.currentPassword,
    };
    console.log(req);

    axios.put(`/api/auth/updatepassword/`, req).then((res) => {
      console.log(res);
      window.location = "/home";
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter current Password:
            <input
              type="password"
              id="current-password"
              name="currentPassword"
              onChange={this.handleChange}
            ></input>
          </label>
          <label>
            Enter new Password:
            <input
              type="password"
              id="new-password"
              name="newPassword"
              onChange={this.handleChange}
            ></input>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default ChangePassword;
