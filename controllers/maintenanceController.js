const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// Get all maintenance requests
exports.getAllMaintenance = async (req, res, next) => {
  try {
    const { status, priority, room } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (room) filter.room = room;
    
    const requests = await Maintenance.find(filter)
      .populate('room')
      .sort('-reportedDate');
    
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// Get single maintenance request
exports.getMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate('room');
    if (!maintenance) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    next(error);
  }
};

// Create maintenance request
exports.createMaintenance = async (req, res, next) => {
  try {
    const { room, issue, priority, technician, estimatedCost, notes } = req.body;
    
    if (!room || !issue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) return res.status(404).json({ error: 'Room not found' });
    
    const maintenance = await Maintenance.create({
      room,
      issue,
      priority,
      technician,
      estimatedCost,
      notes
    });
    
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    next(error);
  }
};

// Update maintenance request
exports.updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('room');
    
    if (!maintenance) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    next(error);
  }
};

// Delete maintenance request
exports.deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, message: 'Maintenance request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get maintenance statistics
exports.getMaintenanceStats = async (req, res, next) => {
  try {
    const total = await Maintenance.countDocuments();
    const open = await Maintenance.countDocuments({ status: 'Open' });
    const inProgress = await Maintenance.countDocuments({ status: 'In Progress' });
    const scheduled = await Maintenance.countDocuments({ status: 'Scheduled' });
    const completed = await Maintenance.countDocuments({ status: 'Completed' });
    
    const highPriority = await Maintenance.countDocuments({ priority: 'High' });
    const critical = await Maintenance.countDocuments({ priority: 'Critical' });
    
    res.json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        scheduled,
        completed,
        highPriority,
        critical
      }
    });
  } catch (error) {
    next(error);
  }
};
