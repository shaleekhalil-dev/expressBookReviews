const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = []; 

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(404).json({ message: "Error logging in" });
    
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    // Exact format required: {"message":"Login successful!"}
    return res.status(200).json({ message: "Login successful!" }); 
});

// Task 9: Add or Modify a book review (Direct endpoint)
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review successfully added/updated", reviews: books[isbn].reviews });
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 10: Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    }
    return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;