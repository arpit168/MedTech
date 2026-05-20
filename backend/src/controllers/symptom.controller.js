import SymptomTimeline from '../models/Prescription.model.js';

export const addSymptomEntry = async (req, res) => {
  try {
    const { date, symptoms, medications, vitals } = req.body;
    
    let timeline = await SymptomTimeline.findOne({ userId: req.user.id });
    
    if (!timeline) {
      timeline = await SymptomTimeline.create({
        userId: req.user.id,
        entries: [],
        summary: {}
      });
    }
    
    timeline.entries.push({ date, symptoms, medications, vitals });
    timeline.updatedAt = Date.now();
    
    await timeline.save();
    
    res.json({ success: true, entry: timeline.entries[timeline.entries.length - 1] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimeline = async (req, res) => {
  try {
    const timeline = await SymptomTimeline.findOne({ userId: req.user.id });
    
    if (!timeline) {
      return res.json({ entries: [], summary: {} });
    }
    
    const symptomFrequency = {};
    let totalSeverity = 0;
    let symptomCount = 0;
    
    timeline.entries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomFrequency[symptom.name] = (symptomFrequency[symptom.name] || 0) + 1;
        totalSeverity += symptom.severity;
        symptomCount++;
      });
    });
    
    const mostFrequentSymptoms = Object.entries(symptomFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
    
    timeline.summary = {
      startDate: timeline.entries[0]?.date,
      endDate: timeline.entries[timeline.entries.length - 1]?.date,
      mostFrequentSymptoms,
      avgSeverity: symptomCount > 0 ? (totalSeverity / symptomCount).toFixed(1) : 0,
      totalEntries: timeline.entries.length
    };
    
    await timeline.save();
    
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const generateDoctorSummary = async (req, res) => {
  try {
    const timeline = await SymptomTimeline.findOne({ userId: req.user.id });
    
    if (!timeline || timeline.entries.length === 0) {
      return res.status(404).json({ message: 'No symptom data available' });
    }
    
    const summary = {
      patientId: req.user.id,
      patientName: req.user.name,
      duration: `${timeline.summary.startDate?.toDateString()} - ${timeline.summary.endDate?.toDateString()}`,
      totalDays: timeline.entries.length,
      mostFrequentSymptoms: timeline.summary.mostFrequentSymptoms,
      averageSeverity: timeline.summary.avgSeverity,
      timelineData: timeline.entries.map(entry => ({
        date: entry.date,
        symptoms: entry.symptoms.map(s => `${s.name} (${s.severity}/10)`),
        vitals: entry.vitals
      })),
      recommendations: generateRecommendations(timeline.summary)
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateRecommendations = (summary) => {
  const recommendations = [];
  
  if (summary.avgSeverity > 7) {
    recommendations.push('High severity symptoms detected. Please consult a doctor immediately.');
  }
  
  if (summary.mostFrequentSymptoms.includes('Fever')) {
    recommendations.push('Monitor temperature regularly. Stay hydrated and rest.');
  }
  
  return recommendations;
};