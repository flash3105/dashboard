import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faList, faBell, faInfoCircle, faHome, faSearch, faQuestionCircle, faNetworkWired, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import { Button } from './Button';

const Sidebar = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    // Handle form submission and send email to JSONPlaceholder
    const handleSubscribe = (e) => {
        e.preventDefault();

        const newSubscriber = { email, subscribedAt: new Date().toISOString() };

        // Using JSONPlaceholder for testing the subscription flow
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSubscriber),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Subscription successful:', data);
            setSubscribed(true);
            setEmail(''); // Clear the email field after successful submission
        })
        .catch((error) => {
            console.error('Error subscribing:', error);
        });
    };

    return (
        <div className="sidebar">
            <ul className="sidebar-container">
                <li className="logo">
                    <FontAwesomeIcon icon={faNetworkWired} size="3x" className="logo-icon"/>
                    <h1>NetInsight</h1>
                </li>

                <li>
                    <Button to="/Home" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faHome} /> HOME
                    </Button>
                </li>
                <li>
                    <Button to="/Overview" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faTachometerAlt} /> OVERVIEW
                    </Button>
                </li>
                <li>
                    <Button to="/Geospatial" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faList} /> RANKS
                    </Button>
                </li>
                <li>
                    <Button to="/Insights" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faSearch} /> INSIGHTS
                    </Button>
                </li>
                <li>
                    <Button to="/History" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faQuestionCircle} /> FAQ
                    </Button>
                </li>
                <li>
                    <Button to="/AN" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faBell} /> ALERTS
                    </Button>
                </li>
                <li>
                    <Button to="/Settings" buttonStyle="btn--outline" activeClassName="active-btn">
                        <FontAwesomeIcon icon={faInfoCircle} /> ABOUT US
                    </Button>
                </li>
            </ul>

            {/* Subscribe form below "About Us" */}
            <div className="subscribe-section">
                <h2>Subscribe to our Newsletter</h2>
                
                {subscribed ? (
                    <p>Thank you for subscribing!</p>
                ) : (
                    <form onSubmit={handleSubscribe} className="subscribe-form">
                        <label className="sign-up">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <button type="submit" className="icon-button">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </label>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
