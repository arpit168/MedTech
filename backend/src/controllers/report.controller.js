import Report from '../models/Report.model.js';
import Tesseract from 'tesseract.js';

const normalRanges = {
  'Hemoglobin': { min: 13.5, max: 17.5, unit: 'g/dL' },
  'RBC': { min: 4.5, max: 5.9, unit: 'million/μL' },
  'WBC': { min: 4.5, max: 11.0, unit: 'thousand/μL' },
  'Platelets': { min: 150, max: 450, unit: 'thousand/μL' },
  'Glucose': { min: 70, max: 100, unit: 'mg/dL' },
  'Cholesterol': { min: 125, max: 200, unit: 'mg/dL' }
};

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    
    const extractedData = extractTestResults(text);
    const abnormalCount = extractedData.filter(item => item.isAbnormal).length;
    
    const report = await Report.create({
      userId: req.user.id,
      reportType: detectReportType(text),
      reportDate: new Date(),
      imageUrl: `/uploads/${req.file.filename}`,
      extractedData,
      abnormalCount,
      summary: generateSummary(extractedData)
    });
    
    res.json({
      success: true,
      report,
      abnormalCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const extractTestResults = (text) => {
  const results = [];
  
  for (const [testName, range] of Object.entries(normalRanges)) {
    const regex = new RegExp(`${testName}[\\s:]*([\\d.]+)`, 'i');
    const match = text.match(regex);
    
    if (match) {
      const value = parseFloat(match[1]);
      const isAbnormal = value < range.min || value > range.max;
      
      results.push({
        testName,
        value: match[1],
        unit: range.unit,
        referenceRange: `${range.min}-${range.max} ${range.unit}`,
        isAbnormal,
        severity: isAbnormal ? (value < range.min ? 'Low' : 'High') : 'Normal',
        normalRangeMin: range.min,
        normalRangeMax: range.max
      });
    }
  }
  
  return results;
};

const detectReportType = (text) => {
  if (text.match(/cbc|complete blood count/i)) return 'CBC';
  if (text.match(/lipid|cholesterol/i)) return 'Lipid Profile';
  if (text.match(/liver|hepatic/i)) return 'Liver Function';
  return 'General Blood Test';
};

const generateSummary = (results) => {
  const abnormal = results.filter(r => r.isAbnormal);
  if (abnormal.length === 0) {
    return 'All values are within normal range.';
  }
  return `${abnormal.length} abnormal value(s) detected: ${abnormal.map(a => a.testName).join(', ')}. Please consult your doctor.`;
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort('-createdAt');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};