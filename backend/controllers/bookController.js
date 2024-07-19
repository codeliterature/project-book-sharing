const Book = require("../models/book");
const User = require("../models/user");

const addBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, description } = req.body;
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

const updateBook = (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedData = req.body;
    const book = Book.findByIdAndUpdate(bookId, updatedData, { new: true })
      .then((updatedDoc) => {
        res.status(200).json({ message: "Book has been updated" });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = Book.findByIdAndDelete(bookId)
      .then((deletedBook) => {
        if (deletedBook) {
          res
            .status(200)
            .json({ message: "Book has been deleted successfully" });
        } else {
          res.status(404).json({ message: "Book not found" });
        }
      })
      .catch((error) => {
        res.status(400).json({ error: "Error deleting book:" });
      });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};


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
