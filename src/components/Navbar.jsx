import React from 'react';
import { maps } from '../data/maps';
import './Navbar.css';

const Navbar = ({ activeMap, onSelectMap, activeView, onViewCommands, onViewUpdates }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => onSelectMap(activeMap || maps[0].id)}>CS2 Lineups</div>
      <div className="navbar-maps">
        {maps.map((map) => (
          <button
            key={map.id}
            className={`nav-item ${activeView === 'map' && activeMap === map.id ? 'active' : ''}`}
            onClick={() => onSelectMap(map.id)}
          >
            {map.name}
          </button>
        ))}
        <div className="nav-divider"></div>
        <button 
           className={`nav-item ${activeView === 'commands' ? 'active' : ''}`}
           onClick={onViewCommands}
        >
          Commands
        </button>
        <button 
           className={`nav-item ${activeView === 'updates' ? 'active' : ''}`}
           onClick={onViewUpdates}
        >
          Updates
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
