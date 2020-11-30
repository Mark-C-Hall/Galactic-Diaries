import React, { Component } from "react";
import axios from "axios";

export class ResetPassword extends Component {
  state = {
    code: "",
    password: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const req = {
      password: this.state.password,
    };

    axios.put(`/api/auth/resetpassword/${this.state.code}`, req).then((res) => {
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
            Enter code from Email:
            <input
              type="text"
              id="lost-password-code"
              name="code"
              onChange={this.handleChange}
            ></input>
          </label>
          <label>
            Enter new Password:
            <input
              type="password"
              id="lost-password-email"
              name="password"
              onChange={this.handleChange}
            ></input>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default ResetPassword;
