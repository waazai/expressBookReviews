const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  return res.status(200).json(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const target = books[isbn];

  
  if (target){
    return res.status(200).json(target)
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const author = req.params.author.split(" ").join("").toLowerCase();
  const results = [];

  for (let key in books) {
    if (books[key].author.split(" ").join("").toLowerCase() === author) {
      results.push({ isbn: key, ...books[key] });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message:"Book not found" });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const title = req.params.title.split(" ").join("").toLowerCase();
  const results = [];

  for (let key in books) {
    if (books[key].title.split(" ").join("").toLowerCase() === title) {
      results.push({ isbn: key, ...books[key] });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message:"Book not found" });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const target = books[isbn].reviews;

  if (target){
    return res.status(200).json(target)
  } else {
    return res.status(404).json({ message: "Book not found" });
  }


});

module.exports.general = public_users;
