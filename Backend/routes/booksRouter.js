import express from 'express';
import Book from '../models/bookSchema.js';
import axios from 'axios';
import verifyToken from "../utils/middleware.js";

const router = express.Router();

//To get all books
router.get("/", verifyToken, async (req, res) => {
    try {
      let books = await Book.find({});
      res.json(books);
    } catch (error) {
      console.error('Error fetching books from Open Library API:', error);
      res.status(500).send('Failed to fetch books from Database');
    }
});

//TO search books
router.post('/search', verifyToken, async (req, res) => {
    const { query } = req.body;
  
    try {
      const existingBooks = await Book.find({ $or: [{ title: { $regex: new RegExp(query, 'i') } }, { author: { $regex: new RegExp(query, 'i') } }, {category: { $regex: new RegExp(query,'i') } } ] });
  
      if (existingBooks.length>0) {
        res.json({ message: "Book found in the database", book: existingBooks });
      } else {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=2`);
  
        const books = response.data.docs.map(book => ({
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown',
          description: book.first_sentence ? book.first_sentence[0] : "No Description Available",
          imageUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
          category: book.subject ? book.subject.join(', ') : 'Unknown',
          publishedDate: book.first_publish_year,
          pageCount: book.number_of_pages_median ? book.number_of_pages_median : 0,
        }));
  
        await Book.insertMany(books);
        
        res.json({ message: 'Books saved and fetched successfully', books });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/shelf", verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { shelf } = req.query;
  try {
    let books;
    if (shelf) {
      books = await Book.find({ 'users': { $elemMatch: { 'userId': userId, 'shelf': shelf } } });
    } else {
      books = await Book.find({ 'users.userId': userId });
    }
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//To get books based on the id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;
    let book = await Book.findById(id);
    res.json(book);
  } catch (error) {
    console.log(error);
  }
})

//To select shelf 
router.post('/:id/shelf', verifyToken, async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.uid;
    const { shelf } = req.body;
    try {
      console.log(userId);
      let book = await Book.findOneAndUpdate(
        { _id: bookId, 'users.userId': userId },
        { $set: { 'users.$.shelf': shelf } },
        { new: true }
      );
      if (!book) {
        book = await Book.findByIdAndUpdate(
          bookId,
          { $push: { users: { userId, shelf } } },
          { new: true }
        );
      }
      res.json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
