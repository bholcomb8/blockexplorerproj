import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const history = useHistory();
  return (
    <header className="header">
      <button onClick={() => history.goBack()} className="back-button">Back</button>
      <div className="title">
        <h1>Ben's Block Explorer</h1>
      </div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </header>
  );
};

export default Header;


