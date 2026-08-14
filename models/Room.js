const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  floor: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', 'Penthouse'],
    required: true
  },
  status: {
    type: String,
    enum: ['vacant', 'occupied', 'maintenance', 'reserved'],
    default: 'vacant'
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  monthlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  amenities: [String],
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Room', roomSchema);
