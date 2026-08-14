const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apartment-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`✓ MongoDB connected to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
