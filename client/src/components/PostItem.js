import React, { Component } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";

class PostItem extends Component {
  render() {
    const { title, content, author } = this.props.post;
    const authorName = author.name;
    const comments = this.props.post.comments;
    return (
      <div>
        <h2>{title}</h2>
        <h3>{authorName}</h3>
        <p>{content}</p>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    );
  }
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostItem;
