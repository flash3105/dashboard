import React, { useState } from 'react';
import { FaPhone } from 'react-icons/fa'; // Replacing user icon with call icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // For navigation to FAQ page
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();

  // Handle search input and navigate to FAQ page
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/History', { state: { query: searchQuery } });
    }
  };

  const toggleSupportTable = () => {
    setShowSupport(!showSupport);
  };

  return (
    <div className="dashboard-header">
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search FAQs..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">Go</button>
      </div>
      <div className="icon-container">
        <FaPhone className="call-icon" onClick={toggleSupportTable} />
        {showSupport && (
          <div className="support-table">
            <table>
              <thead>
                <tr>
                  <th>Contact Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Phone: (+27)64 139 7859</td>
                </tr>
                <tr>
                  <td>Email: support@networkplatform.com</td>
                </tr>
                <tr>
                  <td>Hours: Mon-Fri 9am-5pm</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
