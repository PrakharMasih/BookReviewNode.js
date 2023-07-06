const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists in the session or database
  // Example: Check against an array of registered users
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Save the user in the users array or database
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Find the book with the matching ISBN in the books database
  const book = books[isbn-1];
  
  if (book) {
    res.status(200).json(book); // Send the book details as a JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Send a 404 status code if the book is not found
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  // Find books with the matching author in the books database
  const matchingBooks = books.filter((book) => book.author === author);
  
  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Send the matching books' details as a JSON response
  } else {
    res.status(404).json({ message: "No books found for the author" }); // Send a 404 status code if no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  // Find books with the matching title in the books database
  const matchingBooks = books.filter((book) => book.title === title);
  
  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Send the matching books' details as a JSON response
  } else {
    res.status(404).json({ message: "No books found with the title" }); // Send a 404 status code if no books are found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Find the book with the matching ISBN in the books database
  const book = books[isbn-1];
  console.log(book)
  if (book && book.reviews && book.reviews.length > 0) {
    res.json(book.reviews); // Send the book reviews as a JSON response
  } else {
    res.status(404).json({ message: "No reviews found for the book" }); // Send a 404 status code if no reviews are found
  }
});



module.exports.general = public_users;
