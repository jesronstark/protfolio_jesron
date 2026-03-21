import React from 'react';
import './Experience.css';

export default function Experience({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="section container">
      <h2 className="section-title text-gradient">System Logs</h2>
      
      <div className="experience-grid">
        {data.map((exp, idx) => (
          <div key={idx} className="exp-node">
            <div className="exp-date">{exp.period}</div>
            <div className="glass-panel exp-content" style={idx % 2 === 0 ? {} : { borderColor: 'var(--accent-tertiary)' }}>
              <h3 className="exp-role">{exp.role}</h3>
              <span className="exp-company text-gradient">{exp.company}</span>
              <p className="exp-description">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
