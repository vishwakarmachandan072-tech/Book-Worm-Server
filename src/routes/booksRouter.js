import express from 'express';

import booksController  from '../controller/booksController.js';
import protectRoute from '../middleware/auth.middleware.js'

const router = express.Router();

//create a book
router.post('/', protectRoute, booksController.postBook); //protectRoute is added to prevent any user from screting a book
//read
router.get('/', protectRoute, booksController.getBooks);
router.get('/user', protectRoute, booksController.getUserBooks);
//delete
router.delete('/:id', protectRoute, booksController.deleteBook)
//update

export default router;