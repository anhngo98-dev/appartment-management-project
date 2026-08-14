const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  issue: {
    type: String,
    required: [true, 'Issue description is required']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Scheduled', 'Completed'],
    default: 'Open'
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: Date,
  completedDate: Date,
  technician: String,
  estimatedCost: {
    type: Number,
    default: 0,
    min: 0
  },
  actualCost: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: String,
  workDone: String,
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

maintenanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.requestId) {
    this.requestId = 'M-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
