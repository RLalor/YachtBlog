"use strict";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3005; // PORT FOR RENDER DEPLOYMENT

app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true })); // using instead of bodyparser
app.set("view engine", "ejs");

let posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.post("/submit", (req, res) => {
  const data = req.body;
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;
  const id = uuidv4();

  const newPost = {
    id: id,
    data: data,
    title: postTitle,
    body: postBody,
  };
  posts.push(newPost);
  res.redirect("/");
  console.log(newPost);
});

app.post("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === postId);
  if (post) {
    res.render("edit-post.ejs", { post: post });
  } else {
    res.status(404).send("Post not fou");
  }
});

app.post("/submit-edit/:id", (req, res) => {
  const postId = req.params.id;
  const editedPostTitle = req.body.postTitle;
  const editedPostBody = req.body.postBody;

  let post = posts.find((post) => post.id === postId);

  if (post) {
    post.title = editedPostTitle;
    post.body = editedPostBody;
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/delete/:id", (req, res) => {
  const postId = req.params.id;
  posts = posts.filter((post) => post.id !== postId);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
