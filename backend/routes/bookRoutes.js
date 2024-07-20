const express = require('express');
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");

const { addBook, updateBook, deleteBook, getUserBooks, getAllBooks } = require('../controllers/bookController');

router.post("/addbook", authmiddleware, addBook);
router.put("/updatebook/:id", authmiddleware, updateBook);
router.delete("/deletebook/:id", authmiddleware, deleteBook);
router.get("/mybooks", authmiddleware, getUserBooks);
router.get("/allbooks", getAllBooks);

module.exports = router;