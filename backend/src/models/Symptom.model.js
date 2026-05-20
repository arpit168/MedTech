import mongoose from 'mongoose';  
const symptomEntrySchema = new mongoose.Schema({
  date: Date,
  symptoms: [{
    name: String,
    severity: { type: Number, min: 1, max: 10 },
    timeOfDay: String,
    notes: String
  }],
  medications: [String],
  vitals: {
    temperature: Number,
    bloodPressure: String,
    heartRate: Number,
    oxygenLevel: Number
  }
});

const symptomTimelineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entries: [symptomEntrySchema],
  summary: {
    startDate: Date,
    endDate: Date,
    mostFrequentSymptoms: [String],
    avgSeverity: Number,
    notes: String
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

module.exports = mongoose.model('SymptomTimeline', symptomTimelineSchema);