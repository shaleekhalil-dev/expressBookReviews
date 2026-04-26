const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.some(u => u.username === username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    return res.status(404).json({message: "User already exists!"});
  }
  return res.status(400).json({message: "Username and password are required."});
});

// Task 10: Get all books using Async/Await & Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await Promise.resolve(books); 
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises & Axios logic
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const fetchBook = new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject({status: 404, message: "ISBN not found"});
    });
    fetchBook
        .then(book => res.status(200).json(book))
        .catch(err => res.status(err.status).json({message: err.message}));
});

// Task 12: Get books by Author using Async/Await & Axios logic
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.author === author));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({message: "Author not found"});
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
});

// Task 13: Get books by Title using Async/Await & Axios logic
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.title === title));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({message: "Title not found"});
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) res.status(200).json(books[isbn].reviews);
  else res.status(404).json({message: "No reviews"});
});

module.exports.general = public_users;