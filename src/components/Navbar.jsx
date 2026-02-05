import React from 'react';
import { maps } from '../data/maps';
import './Navbar.css';

const Navbar = ({ activeMap, onSelectMap, activeView, onViewCommands, onViewUpdates }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleMapSelect = (mapId) => {
    onSelectMap(mapId);
    closeMenu();
  };

  const handleViewCommands = () => {
    onViewCommands();
    closeMenu();
  };

  const handleViewUpdates = () => {
      onViewUpdates();
      closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => handleMapSelect(activeMap || maps[0].id)}>CS2 Lineups</div>
      
      <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-maps">
            {maps.map((map) => (
            <button
                key={map.id}
                className={`nav-item ${activeView === 'map' && activeMap === map.id ? 'active' : ''}`}
                onClick={() => handleMapSelect(map.id)}
            >
                {map.name}
            </button>
            ))}
        </div>
        <div className="nav-divider"></div>
        <button 
           className={`nav-item ${activeView === 'commands' ? 'active' : ''}`}
           onClick={handleViewCommands}
        >
          Commands
        </button>
        <button 
           className={`nav-item ${activeView === 'updates' ? 'active' : ''}`}
           onClick={handleViewUpdates}
        >
          Updates
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
