const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", (err) =>{
  if(err)
    console.log(err);
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// MONGOOSE/MODEL CONFIG
let blogSchema = new mongoose.Schema({
  title: {required: true, type : String},
  image: {required: true, type: String},
  body: {required: true, type: String},
  created: {required: true, type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);


// Contents of a blog post in blog site
// title
// image
// body
// Created Date

// RESTful ROUTES

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if(err)
      console.log(err);
    else
      res.render("index", {blogs: allBlogs});
  });
});

app.listen(3000, () => {
  console.log("Server Started");
})