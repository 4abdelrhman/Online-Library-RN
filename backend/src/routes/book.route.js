import express from 'express';
import {
  allBooks,
  addBook,
  editBook,
  deleteBook,
} from '../controllers/books.controller.js';
import protectRoute from '../middlewares/auth.middleware.js';
import allowRoles from '../middlewares/role.middleware.js';

const router = express.Router();

//Admin and user can see the books
router.get('/', protectRoute, allowRoles('admin', 'user'), allBooks);

//Users can borrow books

//Only admins can add books
router.post('/', protectRoute, allowRoles('admin'), addBook);
//Only admins can edit the books
router.put('/edit/:id', protectRoute, allowRoles('admin'), editBook);
//Only admins can delete books
router.delete('/delete/:id', protectRoute, allowRoles('admin'), deleteBook);

export default router;
