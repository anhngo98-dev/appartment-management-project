const Transaction = require('../models/Transaction');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');

// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, status } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(filter)
      .populate('room tenant')
      .sort('-date');
    
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

// Get single transaction
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('room tenant');
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Create transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { date, type, category, amount, description, room, tenant, vendor, paymentMethod, referenceNumber } = req.body;
    
    if (!date || !type || !category || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const transaction = await Transaction.create({
      date,
      type,
      category,
      amount,
      description,
      room,
      tenant,
      vendor,
      paymentMethod,
      referenceNumber
    });
    
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('room tenant');
    
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get financial summary
exports.getFinancialSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(filter);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalIncome - totalExpense;
    
    const byCategory = {};
    transactions.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = 0;
      byCategory[t.category] += t.amount;
    });
    
    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netProfit,
        byCategory,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    next(error);
  }
};
