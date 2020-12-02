import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export class Header extends Component {
  logout = (event) => {
    event.preventDefault();
    axios.get("/api/auth/logout").then((res) => {
      window.location = "/";
    });
  };

  render() {
    return (
      <header className="showcase">
        <div className="container">
          <nav id="menu">
            <h1 className="logo">Galactic Diaries</h1>
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
      </header>
    );
  }
}

export default Header;
