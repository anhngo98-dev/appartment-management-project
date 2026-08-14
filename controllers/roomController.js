const Room = require('../models/Room');
const Tenant = require('../models/Tenant');

// Get all rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    const { status, floor, type } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (floor) filter.floor = floor;
    if (type) filter.type = type;
    
    const rooms = await Room.find(filter).populate('tenant');
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    next(error);
  }
};

// Get single room
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('tenant');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// Create room
exports.createRoom = async (req, res, next) => {
  try {
    const { roomNumber, floor, type, status, area, monthlyRate, amenities, notes } = req.body;
    
    if (!roomNumber || !type || area === undefined || monthlyRate === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    
    const room = await Room.create({
      roomNumber,
      floor,
      type,
      status,
      area,
      monthlyRate,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      notes
    });
    
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    // Remove tenant reference if exists
    if (room.tenant) {
      await Tenant.findByIdAndUpdate(room.tenant, { room: null });
    }
    
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get room statistics
exports.getRoomStats = async (req, res, next) => {
  try {
    const total = await Room.countDocuments();
    const occupied = await Room.countDocuments({ status: 'occupied' });
    const vacant = await Room.countDocuments({ status: 'vacant' });
    const maintenance = await Room.countDocuments({ status: 'maintenance' });
    const reserved = await Room.countDocuments({ status: 'reserved' });
    
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        total,
        occupied,
        vacant,
        maintenance,
        reserved,
        occupancyRate
      }
    });
  } catch (error) {
    next(error);
  }
};
