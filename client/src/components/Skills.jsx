import React from 'react';
import './Skills.css';

export default function Skills({ data }) {
  if (!data) return null;

  const categories = [
    { key: 'frontend', title: 'Frontend Mastery', icon: '🎨' },
    { key: 'backend', title: 'Backend Engine', icon: '⚙️' },
    { key: 'devops', title: 'DevOps & Cloud', icon: '☁️' }
  ];

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <h2 className="section-title">Technical <span className="text-secondary">Skills</span></h2>
        
        <div className="skills-grid">
          {categories.map((category, idx) => {
            const skillsList = data[category.key];
            if (!skillsList || skillsList.length === 0) return null;
            
            return (
              <div key={idx} className="skill-card glass-panel animate-fade-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="skill-card-header">
                  <span className="skill-icon">{category.icon}</span>
                  <h3 className="skill-category-title">{category.title}</h3>
                </div>
                
                <div className="skills-list">
                  {skillsList.map((skill, sIdx) => (
                    <div key={sIdx} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percent">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <div 
                          className="skill-bar-fill" 
                          style={{ 
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, var(--accent-primary), ${idx === 2 ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'})` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
