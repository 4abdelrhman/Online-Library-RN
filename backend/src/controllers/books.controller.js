import Book from '../models/book.model.js';
import cloudinary from '../lib/cloudinary.js';

export const allBooks = async (req, res) => {
  try {
    const books = await Book.find(); //Get all books from DB

    if (!books)
      res.status(400).json({
        success: false,
        message: 'There is no books',
      });
    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error('Error in allBooks controller:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, description, coverURI } = req.body;
    if (!title || !author || !description || !coverURI) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
    const uploadRes = await cloudinary.uploader.upload(coverURI);
    const imgURL = uploadRes.secure_url;
    const newBook = new Book({
      title,
      author,
      description,
      coverURI: imgURL,
    });
    await newBook.save();
    res.status(201).json({
      message: 'Book added Successfully',
      book: newBook,
    });
  } catch (error) {
    console.error('Error in addBook:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle, newAuthor, newDescription, newCoverURI } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      res.status(400).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (newTitle) book.title = newTitle;
    if (newAuthor) book.author = newAuthor;
    if (newDescription) book.description = newDescription;

    if (coverURI && coverURI !== book.coverURI) {
      const uploadRes = await cloudinary.uploader.upload(coverURI, {
        folder: 'book-covers',
      });
      book.coverURI = uploadRes.secure_url;
    }
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    console.error('Error editing book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteBook = async (req, res) => {};
