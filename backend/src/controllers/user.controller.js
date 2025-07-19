import User from '../models/user.model.js';
import Book from '../models/book.model.js';

export const borrowBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    const user = await User.findById(userId);
    const index = user.borrowedBooks.indexOf(bookId);
    //Book already borrowed
    if (index > -1) {
      user.borrowedBooks.splice(index, 1);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Book returned successfully' });
    } else {
      user.borrowedBooks.push(bookId);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Book borrowed successfully' });
    }
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToFav = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });

    const user = await User.findById(userId);
    const index = user.favorites.indexOf(bookId);
    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Book removed successfully' });
    } else {
      user.favorites.push(bookId);
      await user.save();
      return res
        .status(200)
        .json({
          success: true,
          message: 'Book added in favorites successfully',
        });
    }
  } catch (error) {
    console.error('Error adding book to favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
