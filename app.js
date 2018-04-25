const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require("express-sanitizer");
const PORT = process.env.PORT || 3000;

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", (err) =>{
  if(err)
    console.log(err);
});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


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
// Created Data



// RESTFUL ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if(err)
      console.log(err);
    else
      res.render("index", {blogs: allBlogs});
  });
});
// NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
  let newBlog = req.body.blog;
  console.log(req.body.blog.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  //newBlog["created"] = new Date;
  Blog.create(newBlog, (err, newBlog) =>{
    if(err)
      res.render("new");
    else
      res.redirect("/blogs");
  });
});
// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err)
      res.redirect("/blogs");
    else{
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog})
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
  let newData = req.body.blog;
  req.body.blog.body = req.sanitize(req.body.blog.body);  
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err){
      res.send(err);
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id/", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("/routes", (req, res) => {
  res.render("table");
});

app.listen(PORT, () => {
  console.log("Server Started");
});