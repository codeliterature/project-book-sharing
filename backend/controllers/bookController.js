const Book = require("../models/book");
const User = require("../models/user");

const addBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = User.findById(userId);
    const { title, author, description } = req.body;
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    const newBook = await Book.create({
      title,
      author,
      description,
      owner: userId
    });
    await User.findByIdAndUpdate(userId, { $push: { books: newBook._id}})
    res.status(201).json(newBook);
  
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const updatedData = req.body;
    const book = await Book.findById(bookId);
    if (!book){
      return res.status(404).json({message :"book not found"});
    }
    console.log(book.owner);
    if (book.owner != userId){
      return res.status(403).json({message: "Unauthorized access"});
    }
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {new: true});
    if (!updatedBook){
      res.status(400).json({message: "something went wrong"})
    }
    res.status(200).json({message: "Updated Book Successfully"});
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({message :"book not found"});
    }
    if (book.owner != userId){
        return res.status(403).json({message: "Unauthorized access"});
    }
    await User.findByIdAndUpdate(userId, { $pull: { books: book._id}})
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({message: "Book deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


const getUserBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("books").exec();
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user.books)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const getAllBooks = async (req, res) => {
  try {
    const books  = await Book.find().exec()
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = { addBook, updateBook, deleteBook, getUserBooks, getAllBooks };
