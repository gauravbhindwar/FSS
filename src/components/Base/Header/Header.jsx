import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-icon">
        <img src={`./muj-logo.svg`} alt="Logo" className="svg-icon" />
      </div>
    </div>
  );
};

export default Header;
