import React from 'react';

const Header = ({ date }) => {
  return (
    <header className="app-header">
      <h1 className="logo">하루 일어</h1>
      <div className="date-badge">{date}</div>
    </header>
  );
};

export default Header;
