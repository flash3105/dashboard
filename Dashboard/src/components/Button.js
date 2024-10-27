import React from 'react';
import './Button.css';
import { NavLink } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline', 'btn--test'];
const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  to,  // The 'to' prop for routing
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <NavLink
      to={to}
      className={`btn-mobile ${checkButtonStyle} ${checkButtonSize}`}
      activeClassName="active-btn" // This will add the active class when the route is matched
    >
      <button
        className={`my-btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </NavLink>
  );
};
