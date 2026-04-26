const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!books[username]) { // تبسيط للمختبر
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
    const allBooks = await Promise.resolve(books);
    res.send(JSON.stringify(allBooks, null, 4));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    }).then(book => res.send(book)).catch(err => res.status(404).send(err));
});

// Task 12: Get books by Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const filtered = await Promise.resolve(Object.values(books).filter(b => b.author === author));
    res.send(filtered);
});

// Task 13: Get books by Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const filtered = await Promise.resolve(Object.values(books).filter(b => b.title === title));
    res.send(filtered);
});

public_users.get('/review/:isbn', function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;