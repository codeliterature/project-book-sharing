const Book = require("../models/book");

const addBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const newBook = await Book.create({
      title,
      author,
      description,
    });
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

module.exports = { addBook, updateBook, deleteBook };
