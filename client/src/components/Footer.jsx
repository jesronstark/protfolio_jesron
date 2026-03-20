import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer({ data }) {
  if (!data) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-social">
            {data.github && <a href={data.github} target="_blank" rel="noreferrer"><FiGithub /></a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /></a>}
            {data.twitter && <a href={data.twitter} target="_blank" rel="noreferrer"><FiTwitter /></a>}
            {data.instagram && <a href={data.instagram} target="_blank" rel="noreferrer"><FiInstagram /></a>}
            {data.email && <a href={`mailto:${data.email}`} target="_blank" rel="noreferrer"><FiMail /></a>}
          </div>
          
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Jesron. Built with <FiHeart className="heart-icon" /> and React.
          </p>
          
          {data.buymeacoffee && (
            <div className="footer-coffee">
              <a href={data.buymeacoffee} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                ☕ Buy me a coffee
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
