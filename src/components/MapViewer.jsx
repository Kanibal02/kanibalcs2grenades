import React, { useRef, useState, useEffect } from 'react';
import { maps, mapImage } from '../data/maps';
import './MapViewer.css';

// Simple Icons mapping (Assuming files exist in public/images)
const ICONS = {
    smoke: '/images/smoke.svg',
    molotov: '/images/firegrenade.svg',
    flash: '/images/flashbang.svg',
    he: '/images/he.svg',
    target: '/images/mapsmoke.svg' // Maybe used for landing spot?
};

const MapViewer = ({ 
    activeMap, 
    activeLayer = 'upper',
    activeSide = 'both',
    grenades, 
    viewMode, 
    onMarkerClick,
    selectedGrenade = null
}) => {
    // ... (logic remains same)
    // Filter grenades for current map and layer
    const mapGrenades = grenades.filter(g => {
        const isCorrectMap = g.map === activeMap;
        const currentMapData = maps.find(m => m.id === activeMap);
        
        if (currentMapData?.hasLayers) {
            // If map has layers, match the layer (default to upper if not specified in data)
            const grenadeLayer = g.layer || 'upper';
            return isCorrectMap && grenadeLayer === activeLayer;
        }
        
        return isCorrectMap;
    });

    // Clustering Logic
    const getGroupedGrenades = () => {
        const groups = [];
        const threshold = 2.5; // Slightly larger for better mobile/overlapping targets

        mapGrenades.forEach(g => {
            const pos = viewMode === 'landing' ? g.landingPos : g.throwPos;
            
            // Try to find existing group
            const existingGroup = groups.find(group => {
                const groupPos = viewMode === 'landing' ? group[0].landingPos : group[0].throwPos;
                const dx = Math.abs(groupPos.x - pos.x);
                const dy = Math.abs(groupPos.y - pos.y);
                return dx < threshold && dy < threshold;
            });

            if (existingGroup) {
                existingGroup.push(g);
            } else {
                groups.push([g]);
            }
        });
        return groups;
    };

    const groupedData = getGroupedGrenades();

    return (
        <div className="map-container static">
            <div className="map-inner">
                <div className="map-wrapper">
                    <img 
                        src={mapImage(activeMap, activeLayer)} 
                        alt={activeMap} 
                        className="map-image" 
                        draggable={false}
                    />
                    
                    {/* Connection Line Layer */}
                    {selectedGrenade && (
                        <svg className="map-svg-layer">
                            {(Array.isArray(selectedGrenade) ? selectedGrenade : [selectedGrenade]).map((g, i) => {
                                if (g.map !== activeMap) return null;
                                return (
                                    <React.Fragment key={i}>
                                        <line 
                                            x1={`${g.throwPos.x}%`} 
                                            y1={`${g.throwPos.y}%`}
                                            x2={`${g.landingPos.x}%`} 
                                            y2={`${g.landingPos.y}%`}
                                            stroke="var(--accent-color)" 
                                            strokeWidth="2"
                                            strokeDasharray="8,4"
                                            className="grenade-line"
                                            style={{opacity: 0.6}}
                                        />
                                        <circle cx={`${g.throwPos.x}%`} cy={`${g.throwPos.y}%`} r="3" fill="var(--accent-color)" />
                                        <circle cx={`${g.landingPos.x}%`} cy={`${g.landingPos.y}%`} r="3" fill="var(--accent-color)" />
                                    </React.Fragment>
                                );
                            })}
                        </svg>
                    )}
                    
                    {groupedData.map((group, i) => {
                        const first = group[0];
                        const pos = viewMode === 'landing' ? first.landingPos : first.throwPos;
                        const isMulti = group.length > 1;
                        
                        // Check if this specific group contains any part of the selection
                        const isSelected = selectedGrenade && 
                            (Array.isArray(selectedGrenade) 
                                ? selectedGrenade.some(sg => group.some(g => g.id === sg.id))
                                : group.some(g => g.id === selectedGrenade.id));

                        // Icon Logic: If landing and selected smoke -> Show Cloud
                        let iconSrc = ICONS[first.type] || ICONS.smoke;
                        if (viewMode === 'landing' && isSelected && first.type === 'smoke') {
                            iconSrc = ICONS.target;
                        }
                        
                        return (
                            <div
                                key={i}
                                className={`map-marker ${viewMode} ${isMulti ? 'group' : ''} ${isSelected ? 'selected' : ''} ${activeSide === 'T' ? 't-theme' : activeSide === 'CT' ? 'ct-theme' : 'all-theme'}`}
                                style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkerClick(isMulti ? group : first);
                                }}
                            >
                                {isMulti && (!isSelected || viewMode === 'throwing') ? (
                                    <div className="group-count">{group.length}</div>
                                ) : (
                                    <img 
                                        src={iconSrc} 
                                        alt={first.type} 
                                        className={`${isSelected ? 'selected-icon' : ''} ${isSelected && first.type === 'smoke' && viewMode === 'landing' ? 'cloud-icon' : ''}`} 
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MapViewer;
