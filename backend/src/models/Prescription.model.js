import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String,
  duration: String,
  timing: [String],
  warnings: [String]
});

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: String,
  extractedText: String,
  medicines: [medicineSchema],
  conflicts: {
    hasDuplicates: Boolean,
    duplicateMedicines: [String],
    dosageConflicts: [String],
    missingTiming: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prescription', prescriptionSchema);