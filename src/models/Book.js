import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        requried: true,
    },
    caption: {
        type: String,
        requried: true,
    },
    image: {
        type: String,
        requried: true,
    },
    rating: {
        type: Number,
        requried: true,
        min: 1,
        max: 5,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

const Book = mongoose.model("Book", bookSchema);
export default Book;