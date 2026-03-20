import React from 'react';
import { FiMapPin, FiMail, FiCheckCircle } from 'react-icons/fi';
import './About.css';

export default function About({ data }) {
  if (!data) return null;

  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="section-title">About <span className="text-secondary">Me</span></h2>
        
        <div className="about-grid">
          <div className="about-glass glass-panel animate-fade-in-up">
            <h3 className="about-heading text-gradient">My Journey</h3>
            <p className="about-text">{data.bio}</p>
            <p className="about-text">{data.bio2}</p>
            
            <div className="about-info-flex mt-6">
              {data.location && (
                <div className="info-item">
                  <span className="info-icon"><FiMapPin /></span>
                  <div className="info-text">
                    <span className="info-label">Location</span>
                    <span>{data.location}</span>
                  </div>
                </div>
              )}
              {data.email && (
                <div className="info-item">
                  <span className="info-icon"><FiMail /></span>
                  <div className="info-text">
                    <span className="info-label">Email</span>
                    <span>{data.email}</span>
                  </div>
                </div>
              )}
              {data.available !== undefined && (
                <div className="info-item">
                  <span className="info-icon text-success"><FiCheckCircle /></span>
                  <div className="info-text">
                    <span className="info-label">Status</span>
                    <span>{data.available ? 'Available for hire' : 'Currently employed'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="about-glass glass-panel highlight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="about-heading text-gradient">Core Competencies</h3>
            <div className="tags-container mt-4">
              {data.tags?.map((tag, idx) => (
                <span key={idx} className="skill-tag">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="stat-boxes mt-8">
              <div className="stat-box">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years<br/>Experience</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">20+</span>
                <span className="stat-label">Projects<br/>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
