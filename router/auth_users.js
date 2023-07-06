const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if (req.session && req.session.users && req.session.users.includes(username)) {
  return true;
}

const existingUser = users.find((user) => user.username === username);

if (existingUser) {
  return true;
}

return false;
}

const authenticatedUser = (username, password) => {
  // Write your code here to check if the username and password match the ones in your records


  const user = users.find((user) => user.username === username && user.password === password);
  return !!user; 
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username and password match the ones in records
  const isValidUser = authenticatedUser(username, password);

  if (!isValidUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token with the username
  const token = jwt.sign({ username }, "access");

  // Save the user credentials for the session
  users.push({ username, token });

  return res.status(200).json({ message: "User logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.body; // Assuming the user is authenticated and the username is available in the request

  // Find the book by ISBN
  const book = books[isbn-1];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the existing review by the same user on the same ISBN, if any
  const existingReview = book.reviews.find((r) => r.username === username);

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    book.reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body; // Assuming the user is authenticated and the username is available in the request

  // Find the book by ISBN
  const book = books[isbn-1];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Filter and delete the reviews based on the session username
  const filteredReviews = book.reviews.filter((review) => review.username === username);

  if (filteredReviews.length === book.reviews.length) {
    // No reviews were deleted
    return res.status(404).json({ message: "Review not found" });
  } else {
    // Update the book reviews with the filtered reviews
    book.reviews = filteredReviews;
    return res.status(200).json({ message: "Review deleted successfully" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
