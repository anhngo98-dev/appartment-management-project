const Tenant = require('../models/Tenant');
const Room = require('../models/Room');

// Get all tenants
exports.getAllTenants = async (req, res, next) => {
  try {
    const { status, room } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (room) filter.room = room;
    
    const tenants = await Tenant.find(filter)
      .populate('room')
      .sort('-createdAt');
    
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (error) {
    next(error);
  }
};

// Get single tenant
exports.getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('room');
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// Create tenant
exports.createTenant = async (req, res, next) => {
  try {
    const { name, email, phone, room, moveInDate, leaseEndDate, monthlyRent, deposit, notes } = req.body;
    
    if (!name || !room || monthlyRent === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if room exists and is available
    const roomDoc = await Room.findById(room);
    if (!roomDoc) return res.status(404).json({ error: 'Room not found' });
    
    const tenant = await Tenant.create({
      name,
      email,
      phone,
      room,
      moveInDate,
      leaseEndDate,
      monthlyRent,
      deposit,
      notes
    });
    
    // Update room status to occupied
    await Room.findByIdAndUpdate(room, { status: 'occupied', tenant: tenant._id });
    
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// Update tenant
exports.updateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('room');
    
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// Delete tenant
exports.deleteTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    
    // Update room status to vacant
    if (tenant.room) {
      await Room.findByIdAndUpdate(tenant.room, { 
        status: 'vacant',
        tenant: null 
      });
    }
    
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get active tenants count
exports.getActiveTenants = async (req, res, next) => {
  try {
    const count = await Tenant.countDocuments({ status: 'active' });
    res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
};
