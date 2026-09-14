const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({username: username.trim(), password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book) : res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const matches = Object.values(books).filter((book) => book.author.toLowerCase() === author);
  return res.status(200).json(matches);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const matches = Object.values(books).filter((book) => book.title.toLowerCase() === title);
  return res.status(200).json(matches);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book.reviews) : res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
