import React, { Component } from "react";
import PostItem from "./PostItem";
import PropTypes from "prop-types";

class Posts extends Component {
  render() {
    return this.props.posts.map((post) => (
      <PostItem key={post._id} post={post} />
    ));
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
