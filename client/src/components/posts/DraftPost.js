import React, { Component } from "react";
import axios from "axios";

export class DraftPost extends Component {
  state = {
    title: "",
    content: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const req = {
      title: this.state.title,
      content: this.state.content,
    };

    axios.post("/api/posts/", req).then((res) => {
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
            Title:
            <input
              type="text"
              id="input-title"
              name="title"
              onChange={this.handleChange}
            ></input>
          </label>
          <label>
            Content:
            <textarea
              id="input-content"
              name="content"
              onChange={this.handleChange}
            ></textarea>
          </label>
          <button type="submit">Publish your post!</button>
        </form>
      </div>
    );
  }
}

export default DraftPost;
