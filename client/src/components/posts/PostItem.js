import React from "react";
import Comment from "./Comment";
import {
  Container,
  Typography,
  CssBaseline,
  makeStyles,
  Grid,
  Avatar,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  postContainer: {
    border: "1px solid black",
    margin: "20px",
    backgroundColor: "white",
  },
  title: {
    margin: "10px 0",
  },
  author: {
    margin: "5px",
  },
  content: {
    margin: "5px",
  },
}));

export default function PostItem(post) {
  const { title, content, author } = post.post;
  const authorName = author.name;
  const authorThumbnail = `/photos/${author.photo}`;
  const comments = post.post.comments;

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="lg" className={classes.postContainer}>
      <CssBaseline />
      <Typography component="h2" variant="h3" className={classes.title}>
        {title}
      </Typography>
      <Grid
        container
        xs={12}
        direction="row"
        justify="flex-start"
        alignItems="baseline"
      >
        <Avatar alt={authorName} src={authorThumbnail} />
        <Typography component="h3" variant="h6" className={classes.author}>
          {authorName}
        </Typography>
      </Grid>
      <Typography component="p" variant="body1" className={classes.content}>
        {content}
      </Typography>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
}
