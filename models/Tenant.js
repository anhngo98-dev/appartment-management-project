const mongoose = require('mongoose');
const validator = require('validator');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || validator.isEmail(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    trim: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  moveInDate: Date,
  leaseEndDate: Date,
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  notes: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  documents: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'evicted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tenantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tenant', tenantSchema);
