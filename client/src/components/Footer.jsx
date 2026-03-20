import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer({ data }) {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  // Hidden admin trap on clicking the name
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 3) {
      navigate('/admin');
      setClickCount(0);
    }
  };

  if (!data) return null;

  return (
    <footer className="footer section">
      <div className="container">
        <div className="footer-elite-content">
          <h2 className="footer-brand text-gradient">L'ÉLITE</h2>
          
          <div className="footer-social">
            {data.github && <a href={data.github} target="_blank" rel="noreferrer" aria-label="Github"><FiGithub /></a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>}
            {data.twitter && <a href={data.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>}
            {data.instagram && <a href={data.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>}
            {data.email && <a href={`mailto:${data.email}`} target="_blank" rel="noreferrer" aria-label="Email"><FiMail /></a>}
          </div>
          
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Designed by 
            <span 
               className="secret-admin-link" 
               onClick={handleSecretClick}
               title="Triple click to enter Admin Mode"
            >
              Jesron
            </span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
