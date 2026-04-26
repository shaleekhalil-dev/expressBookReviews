const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.some(u => u.username === username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => Promise.resolve(books);
        const allBooks = await getBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).send(err);
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    });
    getBook.then(book => res.send(book)).catch(err => res.status(404).send(err));
});

// Task 12: Get books by Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => Promise.resolve(Object.values(books).filter(b => b.author === author));
        const filteredBooks = await getBooksByAuthor();
        res.send(filteredBooks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Task 13: Get books by Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => Promise.resolve(Object.values(books).filter(b => b.title === title));
        const filteredBooks = await getBooksByTitle();
        res.send(filteredBooks);
    } catch (err) {
        res.status(500).send(err);
    }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;