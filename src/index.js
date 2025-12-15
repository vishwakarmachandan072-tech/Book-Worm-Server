//External module
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

//local module
import authRouter from './routes/authRouter.js';
import booksRouter from './routes/booksRouter.js';
import { connectDB } from './lib/db.js';

const app = express(); 

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json()); // helps to parse json data coming from mobile(frontend)
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);

app.listen(PORT, ()=>{
    console.log(`Server is waiting at http://localhost:${PORT}`);
})