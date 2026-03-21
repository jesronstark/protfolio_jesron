import React from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import './Projects.css';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="projects-section section container">
      <h2 className="section-title text-gradient">System Deployments</h2>
      
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <div key={project.id || idx} className="project-card glass-panel" style={{"--card-accent": project.color || 'var(--accent-primary)'}}>
            
            {/* The dynamically uploaded cloud image mapped here */}
            {project.coverImage && (
              <div className="project-cover">
                <img src={project.coverImage} alt={project.name} loading="lazy" />
                <div className="project-cover-overlay"></div>
              </div>
            )}
            
            <div className="project-content">
              <h3 className="project-title">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              
              <div className="project-stack">
                {project.stack?.map((tech, i) => (
                  <span key={i} className="stack-pill">{tech}</span>
                ))}
              </div>
              
              <div className="project-links">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="p-link">
                    <FiGithub /> Source
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer" className="p-link active-link">
                    <FiExternalLink /> Live Instance
                  </a>
                )}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}
