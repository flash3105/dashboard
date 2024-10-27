import React from 'react';
import './Footer.css'; // Import your custom CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Manyora Networks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
