import React from 'react';
import { FiLayout, FiServer, FiCpu, FiMonitor } from 'react-icons/fi';
import './Skills.css';

export default function Skills({ data }) {
  if (!data) return null;

  const categories = [
    { key: 'frontend', name: 'Frontend Stacks', icon: <FiLayout/>, color: 'var(--accent-primary)', glow: 'rgba(0, 240, 255, 0.3)' },
    { key: 'backend', name: 'Node / Database', icon: <FiServer/>, color: 'var(--accent-secondary)', glow: 'rgba(255, 0, 85, 0.3)' },
    { key: 'devops', name: 'Cloud / DevOps', icon: <FiCpu/>, color: 'var(--accent-tertiary)', glow: 'rgba(112, 0, 255, 0.3)' }
  ];

  return (
    <section id="skills" className="section container">
      <h2 className="section-title text-gradient">Technical Arsenal</h2>
      
      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className={`glass-panel skill-category ${cat.key}-cat`}>
            <div className="cat-head">
              <span className="cat-icon" style={{color: cat.color}}>{cat.icon}</span>
              <h3 className="cat-name">{cat.name}</h3>
            </div>
            
            <div className="skills-stack">
              {data[cat.key]?.map((skill, i) => (
                <div key={i} className="skill-node">
                  <div className="skill-node-info">
                    <span className="skill-node-name">{skill.name}</span>
                    <span className="skill-node-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-track">
                    <div 
                      className="skill-fill" 
                      style={{ 
                        width: `${skill.level}%`, 
                        background: `linear-gradient(90deg, ${cat.color}, #fff)`,
                        boxShadow: `0 0 15px ${cat.glow}`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
