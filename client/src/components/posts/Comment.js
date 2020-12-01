import React, { Component } from "react";
import PropTypes from "prop-types";

export class Comment extends Component {
  render() {
    const { content } = this.props.comment;
    const comments = this.props.comment.comments;
    return (
      <div>
        <p>{content}</p>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.array.isRequired,
};

export default Comment;
