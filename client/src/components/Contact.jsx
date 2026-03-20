import React, { useState } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import './Contact.css';

export default function Contact({ data }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending...');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (result.success) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      setStatus('An error occurred.');
    }
    
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <section id="contact" className="contact section">
      <div className="container contact-container">
        <div className="contact-text animate-fade-in-up">
          <h2 className="section-title" style={{ left: '0', transform: 'none', textAlign: 'left' }}>
             {data.heading}
             <span className="text-secondary">.</span>
          </h2>
          <p className="contact-subheading">{data.subheading}</p>
          
          <div className="contact-cards">
             <div className="contact-card glass-panel">
                <FiMessageSquare className="contact-icon" />
                <h4>Let's chat!</h4>
                <p>Feel free to reach out for a coffee chat or project collaboration.</p>
             </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="form-title">Send me a message</h3>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              placeholder="John Doe"
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="john@example.com"
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message" className="form-label">Your Message</label>
            <textarea 
              id="message" 
              rows="5" 
              className="form-input" 
              placeholder="How can I help you?"
              required 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={status === 'sending...'}>
            {status === 'sending...' ? 'Sending...' : <><FiSend /> Send Message</>}
          </button>
          
          {status && status !== 'sending...' && (
            <p className={`status-msg ${status.includes('success') ? 'success' : 'error'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
