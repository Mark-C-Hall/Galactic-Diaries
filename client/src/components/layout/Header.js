import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export class Header extends Component {
  logout = (event) => {
    event.preventDefault();
    axios.get("/api/auth/logout").then((res) => {
      console.log(res);
      window.location = "/";
    });
  };

  render() {
    return (
      <div>
        <nav id="menu">
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/draftPost">Create Post</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <button onClick={this.logout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
