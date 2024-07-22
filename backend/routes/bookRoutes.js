const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');

// Import controllers
const bookController = require('../controllers/bookController');

// Book Routes (protected)
router.post('/addbook', authMiddleware, bookController.addBook);
router.put('/updatebook/:id', authMiddleware, bookController.updateBook);
router.delete('/deletebook/:id', authMiddleware, bookController.deleteBook);
router.get('/mybooks', authMiddleware, bookController.getUserBooks);
router.get('/allbooks', bookController.getAllBooks);

module.exports = router;