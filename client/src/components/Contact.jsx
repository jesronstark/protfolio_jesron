import React from 'react';
import { FiSend, FiMessageSquare, FiExternalLink } from 'react-icons/fi';
import './Contact.css';

export default function Contact({ data }) {
  if (!data) return null;

  return (
    <section id="contact" className="section container">
      <div className="contact-grid">
        <div className="contact-info">
          <h2 className="section-title text-gradient">Initialize Comms</h2>
          <div className="contact-header">
            <h3 className="contact-heading">{data.heading || "Ready to ship?"}</h3>
            <p className="contact-subtitle">{data.subheading || "Let's build something exceptional together."}</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a href="mailto:Jesronstark@gmail.com" className="btn btn-primary"><FiExternalLink /> Direct Email</a>
            <a href="https://wa.me/919629199741" target="_blank" rel="noreferrer" className="btn btn-whatsapp"><FiMessageSquare /> WhatsApp</a>
          </div>
        </div>

        <form className="glass-panel contact-card contact-form">
          <div className="form-group">
            <label className="form-label">System Identity</label>
            <input type="text" className="form-input" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Digital Address</label>
            <input type="email" className="form-input" placeholder="Email@domain.com" />
          </div>
          <div className="form-group form-full">
            <label className="form-label">Transmission Protocol</label>
            <input type="text" className="form-input" placeholder="Subject / Objective" />
          </div>
          <div className="form-group form-full">
            <label className="form-label">Message Payload</label>
            <textarea className="form-input" rows="5" placeholder="Operational details..."></textarea>
          </div>
          <button type="button" className="btn btn-primary form-full" style={{background: 'var(--accent-primary)', color: 'black'}}><FiSend /> Dispatch Payload</button>
        </form>
      </div>
    </section>
  );
}
