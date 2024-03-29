import React, { Component } from "react";
import axios from "axios";
import Posts from "../posts/Posts";

export class Home extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios
      .get("/api/posts")
      .then((res) => this.setState({ posts: res.data.data }));
  }

  render() {
    return (
      <div className="container">
        <Posts posts={this.state.posts} />
      </div>
    );
  }
}

export default Home;
