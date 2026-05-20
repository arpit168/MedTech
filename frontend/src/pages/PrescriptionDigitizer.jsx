import React, { useState } from 'react';

const PrescriptionDigitizer = () => {
  const [medicines, setMedicines] = useState([]);

  const handleExtract = () => {
    // Example extracted medicines (replace with actual logic)
    setMedicines([
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day' },
      { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times a day' },
    ]);
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: 'Inter, sans-serif', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fafb, #eef2ff)' 
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)', 
        padding: '30px' 
      }}>
        
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '20px', 
          fontWeight: 'bold', 
          color: '#2563eb', 
          textAlign: 'center' 
        }}>
          Prescription Digitizer
        </h2>

        <button 
          onClick={handleExtract} 
          style={{ 
            padding: '12px 24px', 
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'block',
            margin: '0 auto 30px'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Extract Medicines
        </button>

        <h3 style={{ 
          fontSize: '22px', 
          marginBottom: '16px', 
          color: '#374151', 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '8px' 
        }}>
          Extracted Medicines
        </h3>

        {medicines.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {medicines.map((med, index) => (
              <li 
                key={index} 
                style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '10px', 
                  background: '#f9fafb', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <div>
                  <strong style={{ color: '#111827', fontSize: '18px' }}>{med.name}</strong>
                  <p style={{ margin: '4px 0', color: '#6b7280' }}>
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
                <span style={{ 
                  background: '#2563eb', 
                  color: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '14px' 
                }}>
                  Medicine
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center' }}>
            No medicines extracted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDigitizer;
