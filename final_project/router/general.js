const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
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


public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});


public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book) : res.status(404).json({message: "Book not found"});
 });
  
public_users.get('/author/:author',function (req, res) {
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const matches = Object.values(books).filter((book) => book.author.toLowerCase() === author);
  return res.status(200).json(matches);
});


public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const matches = Object.values(books).filter((book) => book.title.toLowerCase() === title);
  return res.status(200).json(matches);
});


public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book.reviews) : res.status(404).json({message: "Book not found"});
});

public_users.getBooks = async function () {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("All books:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
};

public_users.getBookByISBN = function (isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log("Book by ISBN:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching book by ISBN:", error.message);
    });
};

public_users.getBooksByAuthor = function (author) {
  return axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then((response) => {
      console.log("Books by author:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching books by author:", error.message);
    });
};

public_users.getBooksByTitle = async function (title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log("Books by title:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
};


module.exports.general = public_users;
