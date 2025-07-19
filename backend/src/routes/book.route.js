import express from 'express';
import {
  allBooks,
  addBook,
  editBook,
  deleteBook,
} from '../controllers/books.controller.js';
import { borrowBook, addToFav } from '../controllers/user.controller.js';
import protectRoute from '../middlewares/auth.middleware.js';
import allowRoles from '../middlewares/role.middleware.js';

const router = express.Router();

//Admin and user can see the books
router.get('/', protectRoute, allowRoles('admin', 'user'), allBooks);

//Only users can borrow books
router.post('/borrow/:id', protectRoute, allowRoles('user'), borrowBook);
//Only users can add to favourites
router.post('/favorite/:id', protectRoute, allowRoles('user'), addToFav);

//Only admins can add books
router.post('/', protectRoute, allowRoles('admin'), addBook);
//Only admins can edit the books
router.put('/:id', protectRoute, allowRoles('admin'), editBook);
//Only admins can delete books
router.delete('/:id', protectRoute, allowRoles('admin'), deleteBook);

export default router;
