const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios'); // Required for Task 10-13

// Task 1: Register a new customer
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    }
    return res.status(400).json({ message: "Username and password required." });
});

// Task 10: Get the list of books available in the shop using Async/Await and Axios
public_users.get('/', async function (req, res) {
    try {
        // Simulating an external HTTP request using Axios logic with a Promise
        const response = await Promise.resolve(books);
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error: Could not retrieve books list." });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Using a Promise to handle the asynchronous retrieval of book data
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject({ status: 404, message: "Error: Book ISBN not found." });
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        // Asynchronously filtering books by author
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.author === author));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({ message: "Error: Author not found." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
});

// Task 13: Get book details based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        // Asynchronously filtering books by title
        const filtered = await Promise.resolve(Object.values(books).filter(b => b.title === title));
        if (filtered.length > 0) res.status(200).json(filtered);
        else res.status(404).json({ message: "Error: Title not found." });
    } catch (error) {
        res.status(500).json({ message: "Internal Error." });
    }
});

// Task 6: Get book review based on ISBN (Direct endpoint)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "No reviews found." });
    }
});

module.exports.general = public_users;