import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js'

const postBook = async (req,res,next) => {
    try {
        const { title, caption, rating, image } = req.body;

        if(!image || !title || !caption || !rating) return res.status(400).json({ message: "All fiels are required" });


        //save the image to db
        const newBook = new Book({
            title, 
            caption, 
            rating, 
            image: image,
            user: req.user._id,
        });

        await newBook.save();
        res.status(201).json(newBook);

    } catch (error) {
        console.log("Error creating the book: ", error);
        res.status(500).json({ message: error.message });
    }
}

//const response = await fetch('http://localhost:3000/api/books?page=1&limit=4');

//pagination => infinite scroll
const getBooks = async (req,res,next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 4;
        const skip = (page - 1) * limit;

        const books = await Book.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.status(200).json(
            {books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks/ limit)
        }
        ); //status 200 if not set

    } catch (error) {
        console.log("Error geting books: ", error.message);
        res.status(500).json({message: "Inernal Server error"});
    }
}

const deleteBook = async (req,res,next) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({ message: "Book not Found "});

        //check if user is creator of the book
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized "});
        }

        //delete image for cloudinary //https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
        if(book.image && book.image.includes('cloudinary')){
            try {
                //publicID = sample
                const publicId = book.image.split('/').pop().split('.')[0]; //extract public id from url
                await cloudinary.uploader.destroy(publicId);
                
            } catch (error) {
                console.log("Error deleting image from cloudinary: ", error.message);
                
            }
        }

        await book.deleteOne();

        res.json({ message: "Book deleted successfully "});
    } catch (error) {
        console.log("Error deleting book:", error.message);
        res.status(500).json({ message: "Internal server error "});
    }
}

const getUserBooks = async (req,res,next) => {
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
        console.log("Error getting user books: ", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}

const booksController = {
    postBook,
    getBooks,
    deleteBook,
    getUserBooks,
}

export default booksController;