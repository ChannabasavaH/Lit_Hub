import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title : {
        type: String,
        require: true
    },
    author : {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String
    },
    category: {
        type: String,
        require: true,
    },
    publishedDate: {
        type: Date,
        require: true
    },
    pageCount: {
        type: Number,
        require: true
    },
    users: [
        {
            userId: { type: String, required: true }, // Use String type for Firebase uid
            shelf: String,
        }
    ]
});

const Book = mongoose.model("Book",bookSchema);

export default Book;