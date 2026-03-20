import React from 'react';
import './Experience.css';

export default function Experience({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="experience section">
      <div className="container">
        <h2 className="section-title">Work <span className="text-secondary">Experience</span></h2>
        
        <div className="timeline">
          {data.map((exp, idx) => (
            <div key={exp.id || idx} className="timeline-item animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-panel">
                <div className="timeline-date">{exp.period}</div>
                <h3 className="timeline-role text-gradient">{exp.role}</h3>
                <h4 className="timeline-company">{exp.company}</h4>
                <p className="timeline-desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
