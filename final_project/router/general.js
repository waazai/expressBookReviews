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
public_users.get('/', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //return res.status(200).json(books);

  try {
    const bookList = await Promise.resolve(books);

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const bookData = await Promise.resolve(book);
    return res.status(200).json(bookData);
  }catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  try {
    const inputAuthor = req.params.author.replace(/\s+/g, '').toLowerCase();
    const results = await Promise.resolve(
      Object.entries(books)
        .filter(([isbn, book]) =>
          book.author.replace(/\s+/g, '').toLowerCase() === inputAuthor
        )
        .map(([isbn, book]) => ({ isbn, ...book }))
    );

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  try {
    const inputTitle = req.params.title.replace(/\s+/g, '').toLowerCase();

    // 模擬 async 資料查詢
    const results = await Promise.resolve(
      Object.entries(books)
        .filter(([isbn, book]) =>
          book.title.replace(/\s+/g, '').toLowerCase() === inputTitle
        )
        .map(([isbn, book]) => ({ isbn, ...book }))
    );

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
