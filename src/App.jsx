import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Commands from './components/Commands';
import Updates from './components/Updates';
import MapViewer from './components/MapViewer';
import SidePanel from './components/SidePanel';
import { maps } from './data/maps';
import grenadesRaw from './data/grenades/index.js';
import commandsData from './data/commands.json';
import updatesData from './data/updates.json';
import './index.css'; 
import './App.css'; // Add this

// Simple modal component for grenade details

function App() {
  // Initialize from hash
  const getInitialState = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'commands') return { view: 'commands', mapId: maps[0].id };
    if (hash === 'updates') return { view: 'updates', mapId: maps[0].id };
    
    const found = maps.find(m => m.id === hash);
    return { view: 'map', mapId: found ? found.id : maps[0].id };
  };

  const initialState = getInitialState();
  const [activeView, setActiveView] = useState(initialState.view);
  const [activeMap, setActiveMap] = useState(initialState.mapId);
  const [activeLayer, setActiveLayer] = useState('upper');
  const [viewMode, setViewMode] = useState('landing'); // 'landing' or 'throwing'
  const [selectedGrenade, setSelectedGrenade] = useState(null);
  const [activeSide, setActiveSide] = useState('both'); // 'T', 'CT', or 'both'
  const [grenades, setGrenades] = useState(grenadesRaw);

  // Sync state to URL Hash
  useEffect(() => {
    let hash = activeMap;
    if (activeView === 'commands') hash = 'commands';
    if (activeView === 'updates') hash = 'updates';
    window.location.hash = hash;
  }, [activeMap, activeView]);

  // Handle back/forward navigation or manual URL edits
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'commands') {
        setActiveView('commands');
      } else if (hash === 'updates') {
        setActiveView('updates');
      } else {
        const found = maps.find(m => m.id === hash);
        if (found) {
          setActiveMap(found.id);
          setActiveView('map');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Live Refresh: Sync state when grenadesRaw (the JSON file) changes (Vite HMR)
  useEffect(() => {
    setGrenades(grenadesRaw);
  }, [grenadesRaw]);

  const handleMarkerClick = (data) => {
    // data can be single object OR array of grenades (group)
    setSelectedGrenade(data);
  };

  const renderContent = () => {
    if (activeView === 'commands') {
      return <Commands commands={commandsData} />;
    }
    
    if (activeView === 'updates') {
      return <Updates updates={updatesData} />;
    }

    // Filter grenades by side
    const filteredGrenades = grenades.filter(g => {
        if (activeSide === 'both') return true;
        return g.side === activeSide || g.side === 'both';
    });

    // Default: Map View
    return (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
                <div className="toggle-group">
                    <button 
                        className={viewMode === 'landing' ? 'active' : ''} 
                        onClick={() => setViewMode('landing')}
                    >
                        Landing
                    </button>
                    <button 
                        className={viewMode === 'throwing' ? 'active' : ''} 
                        onClick={() => setViewMode('throwing')}
                    >
                        Origin
                    </button>
                </div>

                <div className="toggle-group side-toggle">
                    <button 
                        className={activeSide === 'T' ? 'active t-side' : ''} 
                        onClick={() => setActiveSide('T')}
                    >
                        T
                    </button>
                    <button 
                        className={activeSide === 'both' ? 'active' : ''} 
                        onClick={() => setActiveSide('both')}
                    >
                        All
                    </button>
                    <button 
                        className={activeSide === 'CT' ? 'active ct-side' : ''} 
                        onClick={() => setActiveSide('CT')}
                    >
                        CT
                    </button>
                </div>
            </div>

            {/* Dynamic Layer Toggle */}
            {maps.find(m => m.id === activeMap)?.hasLayers && (
                <div className="toggle-group layer-toggle">
                    <button 
                        className={activeLayer === 'upper' ? 'active' : ''} 
                        onClick={() => setActiveLayer('upper')}
                    >
                        Upper
                    </button>
                    <button 
                        className={activeLayer === 'lower' ? 'active' : ''} 
                        onClick={() => setActiveLayer('lower')}
                    >
                        Lower
                    </button>
                </div>
            )}

            <div className="hint">
                {viewMode === 'landing' ? 'Showing where grenades land' : 'Showing where to throw from'}
            </div>
          </div>

          <div className="main-content">
            <MapViewer 
                activeMap={activeMap}
                activeLayer={activeLayer}
                activeSide={activeSide}
                grenades={filteredGrenades}
                viewMode={viewMode}
                onMarkerClick={handleMarkerClick}
                selectedGrenade={selectedGrenade} // To draw lines
            />
            
            <SidePanel 
                selectedData={selectedGrenade} 
                onClose={() => setSelectedGrenade(null)}
                onViewDetails={(singleGrenade) => {
                    setSelectedGrenade(singleGrenade);
                }}
            />
          </div>
        </>
    );
  };

  return (
    <div className="app">
      <Navbar 
        activeMap={activeMap} 
        activeView={activeView}
        onSelectMap={(id) => {
            setActiveMap(id);
            setActiveLayer('upper'); // Reset to top floor
            setActiveView('map');
        }} 
        onViewCommands={() => setActiveView('commands')}
        onViewUpdates={() => setActiveView('updates')}
      />
      
      {renderContent()}
    </div>
  );
}

export default App;
