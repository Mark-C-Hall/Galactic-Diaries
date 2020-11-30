import React, { Component } from "react";
import axios from "axios";

export class ForgotPassword extends Component {
  state = {
    email: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const req = {
      email: this.state.email,
    };
    axios.post("/api/auth/forgotpassword", req).then((res) => {
      console.log(res);
      window.location = "/resetPassword";
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
            Enter Email:
            <input
              type="text"
              id="lost-password-email"
              name="email"
              onChange={this.handleChange}
            ></input>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
