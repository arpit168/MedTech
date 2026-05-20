import Prescription from '../models/Prescription.model.js';
import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';


export const analyzePrescription = (medicines) => {
  const conflicts = {
    hasDuplicates: false,
    duplicateMedicines: [],
    dosageConflicts: [],
    missingTiming: []
  };
  
  const medicineNames = medicines.map(m => m.name.toLowerCase());
  const duplicates = medicineNames.filter((name, index) => medicineNames.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    conflicts.hasDuplicates = true;
    conflicts.duplicateMedicines = [...new Set(duplicates)];
  }
  
  medicines.forEach(medicine => {
    if (!medicine.timing || medicine.timing.length === 0) {
      conflicts.missingTiming.push(medicine.name);
    }
    
    const dosageNum = parseInt(medicine.dosage);
    if (dosageNum > 1000) {
      conflicts.dosageConflicts.push(`${medicine.name}: Dosage ${medicine.dosage} seems unusually high`);
    }
  });
  
  return conflicts;
};

export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imagePath = req.file.path;
    
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    
    const medicines = extractMedicinesFromText(text);
    const conflicts = analyzePrescription(medicines);
    
    const prescription = await Prescription.create({
      userId: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      extractedText: text,
      medicines,
      conflicts
    });
    
    res.json({
      success: true,
      prescription,
      analysis: conflicts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const extractMedicinesFromText = (text) => {
  const medicines = [];
  const lines = text.split('\n');
  
  const commonMedicines = ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Azithromycin', 'Cetirizine'];
  
  lines.forEach(line => {
    commonMedicines.forEach(medicine => {
      if (line.toLowerCase().includes(medicine.toLowerCase())) {
        medicines.push({
          name: medicine,
          dosage: extractDosage(line),
          frequency: extractFrequency(line),
          timing: extractTiming(line),
          warnings: []
        });
      }
    });
  });
  
  return medicines;
};

const extractDosage = (text) => {
  const dosageMatch = text.match(/\d+\s*(mg|gm|ml|tablet|cap)/i);
  return dosageMatch ? dosageMatch[0] : 'Not specified';
};

const extractFrequency = (text) => {
  if (text.match(/twice|2 times|bid/i)) return 'Twice daily';
  if (text.match(/thrice|3 times|tid/i)) return 'Thrice daily';
  if (text.match(/once|1 time|od/i)) return 'Once daily';
  return 'As directed';
};

const extractTiming = (text) => {
  const timing = [];
  if (text.match(/morning|breakfast/i)) timing.push('Morning');
  if (text.match(/afternoon|lunch/i)) timing.push('Afternoon');
  if (text.match(/evening|dinner/i)) timing.push('Evening');
  if (text.match(/night|bedtime/i)) timing.push('Night');
  return timing;
};

export const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id }).sort('-createdAt');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};