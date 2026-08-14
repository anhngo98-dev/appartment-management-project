const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, transactionController.getAllTransactions);
router.get('/summary/financial', protect, transactionController.getFinancialSummary);
router.get('/:id', protect, transactionController.getTransaction);
router.post('/', protect, authorize('admin', 'manager', 'staff'), transactionController.createTransaction);
router.put('/:id', protect, authorize('admin', 'manager'), transactionController.updateTransaction);
router.delete('/:id', protect, authorize('admin'), transactionController.deleteTransaction);

module.exports = router;
