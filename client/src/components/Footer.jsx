import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer({ data }) {
  const navigate = useNavigate();

  const handleSecretGateway = () => {
    // Hidden gateway to admin panel
    navigate('/admin');
  };

  if (!data) return null;

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h3 className="footer-logo text-gradient">&lt;Jesron /&gt;</h3>
            <p className="footer-bio">Building robust, scalable applications and secure architectures. Always learning and innovating.</p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
          </div>

          <div className="footer-contact-col">
            <h4>Contact Integrations</h4>
            <a href="https://wa.me/919629199741" target="_blank" rel="noreferrer" className="footer-contact-link">
              <FaWhatsapp className="icon-whatsapp" /> +91 9629199741
            </a>
            <a href="mailto:Jesronstark@gmail.com" className="footer-contact-link">
              <FiMail className="icon-mail" /> Jesronstark@gmail.com
            </a>
            <div className="footer-socials mt-4">
              {data.github && <a href={data.github} target="_blank" rel="noreferrer"><FiGithub /></a>}
              {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /></a>}
              {data.twitter && <a href={data.twitter} target="_blank" rel="noreferrer"><FiTwitter /></a>}
              {data.instagram && <a href={data.instagram} target="_blank" rel="noreferrer"><FiInstagram /></a>}
            </div>
          </div>
          
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} All rights reserved. 
          </p>
          {/* SECURE PADDING PORTAL - Hidden Admin Link */}
          <div className="secure-portal-padding" onClick={handleSecretGateway} title="Secure Portal">
             jesron
          </div>
        </div>
      </div>
    </footer>
  );
}
