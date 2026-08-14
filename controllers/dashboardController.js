const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const Transaction = require('../models/Transaction');
const Maintenance = require('../models/Maintenance');

// Get dashboard overview
exports.getDashboardOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Room statistics
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
    const vacantRooms = await Room.countDocuments({ status: 'vacant' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });
    const reservedRooms = await Room.countDocuments({ status: 'reserved' });
    
    // Tenant statistics
    const activeTenants = await Tenant.countDocuments({ status: 'active' });
    
    // Financial statistics (current month)
    const monthTransactions = await Transaction.find({
      date: { $gte: monthStart, $lte: monthEnd }
    });
    
    const monthlyRevenue = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Maintenance statistics
    const openIssues = await Maintenance.countDocuments({ status: 'Open' });
    const inProgressIssues = await Maintenance.countDocuments({ status: 'In Progress' });
    const criticalIssues = await Maintenance.countDocuments({ priority: 'Critical' });
    
    // YTD calculations
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const ytdTransactions = await Transaction.find({
      date: { $gte: yearStart, $lte: now }
    });
    
    const ytdRevenue = ytdTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const ytdExpense = ytdTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      data: {
        kpi: {
          monthlyRevenue,
          occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
          activeTenants,
          openIssues
        },
        rooms: {
          total: totalRooms,
          occupied: occupiedRooms,
          vacant: vacantRooms,
          maintenance: maintenanceRooms,
          reserved: reservedRooms
        },
        finance: {
          monthlyRevenue,
          monthlyExpense,
          monthlyProfit: monthlyRevenue - monthlyExpense,
          ytdRevenue,
          ytdExpense,
          ytdProfit: ytdRevenue - ytdExpense
        },
        maintenance: {
          open: openIssues,
          inProgress: inProgressIssues,
          critical: criticalIssues
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue history
exports.getRevenueHistory = async (req, res, next) => {
  try {
    const { months = 7 } = req.query;
    const now = new Date();
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const transactions = await Transaction.find({
        date: { $gte: monthStart, $lte: monthEnd }
      });
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        month: date.toLocaleString('en-US', { month: 'short' }),
        income,
        expense
      });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
