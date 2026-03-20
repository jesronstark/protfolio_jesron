import React from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import './Projects.css';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <h2 className="section-title">Featured <span className="text-secondary">Projects</span></h2>
        
        <div className="projects-grid">
          {projects.map((project, idx) => (
            <div key={project.id || idx} className="project-card glass-panel animate-fade-in-up" 
                 style={{ animationDelay: `${idx * 0.15}s`, '--project-color': project.color || 'var(--accent-primary)' }}>
              
              <div className="project-color-bar"></div>
              
              <div className="project-content">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                
                <div className="project-stack">
                  {project.stack?.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  {project.github && project.github !== '#' && (
                     <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                       <FiGithub /> Source
                     </a>
                  )}
                  {project.live && project.live !== '#' && (
                     <a href={project.live} target="_blank" rel="noreferrer" className="project-link">
                       <FiExternalLink /> Live Demo
                     </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
