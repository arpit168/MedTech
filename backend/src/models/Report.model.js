import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  testName: String,
  value: String,
  unit: String,
  referenceRange: String,
  isAbnormal: Boolean,
  severity: String,
  normalRangeMin: Number,
  normalRangeMax: Number
});

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: String,
  reportDate: Date,
  imageUrl: String,
  extractedData: [testResultSchema],
  abnormalCount: Number,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);