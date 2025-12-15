//External module
import express from 'express';

//local module
import authController from '../controller/authController.js';


const router = express.Router();

router.post('/register', authController.postRegister);

router.post('/login', authController.postLogin);

export default router;