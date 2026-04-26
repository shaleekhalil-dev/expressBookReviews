const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = require("./general.js").users;

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(404).json({message: "Error logging in"});
  
  // ملاحظة: تأكد أن اسم المستخدم موجود في المصفوفة
  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {accessToken, username};
  return res.status(200).json({message: "Login successful!"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];
  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review added/updated successfully", reviews: books[isbn].reviews});
  }
  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
  }
  return res.status(404).json({message: "No review found"});
});

module.exports.authenticated = regd_users;