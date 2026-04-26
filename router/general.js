const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios'); 

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({message: "Registration failed: Username and password are required."});
  }
  let users = []; // ملاحظة: تأكد من ربطها بمصفوفة المستخدمين الحقيقية إذا كانت موجودة
  users.push({"username":username,"password":password});
  return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const response = await Promise.resolve(books);
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(500).json({message: "Internal Server Error: Could not retrieve books list."});
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject({status: 404, message: `Error: Book with ISBN ${isbn} not found in our database.`});
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(err.status).json({message: err.message}));
});

// Task 12: Get books by Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.author === author));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({message: `Error: No books found for author '${author}'.`});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error: Retrieval failed."});
    }
});

// Task 13: Get books by Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.title === title));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({message: `Error: No books found with title '${title}'.`});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."});
    }
});

// Task 6: Get Book Review (Correct Endpoint)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).json(books[isbn].reviews);
  } else {
      res.status(404).json({message: `Error: Cannot find reviews for ISBN ${isbn}. Book not found.`});
  }
});

module.exports.general = public_users;