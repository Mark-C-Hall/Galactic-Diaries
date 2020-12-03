import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  nestedComment: {
    marginLeft: "25px",
    marginTop: "10px",
  },
}));

export default function Comment(comment) {
  const [authorName, setAuthorName] = useState("");

  const classes = useStyles();

  const { content, author } = comment.comment;
  const nestedComments = comment.comment.comments;

  useEffect(() => {
    axios
      .get(`/api/users/${author}`)
      .then((res) => setAuthorName(res.data.data.name));
  });

  return (
    <div className={classes.nestedComment}>
      <Typography content="p" variant="body1" align="left">
        {authorName}
      </Typography>
      <Typography content="p" variant="body2" align="left">
        {content}
      </Typography>
      {nestedComments.map((nestedComment) => (
        <Comment key={nestedComment._id} comment={nestedComment} />
      ))}
    </div>
  );
}
