import React from 'react';
import './SidePanel.css';

const SidePanel = ({ selectedData, onClose, onViewDetails }) => {
    const [zoomedImage, setZoomedImage] = React.useState(null);
    
    if (!selectedData) return null;

    const isGroup = Array.isArray(selectedData);
    
    return (
        <>
            <div className={`side-panel ${selectedData ? 'open' : ''}`}>
                <div className="panel-header">
                    <h2>{isGroup ? `${selectedData.length} Grenades` : selectedData.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="panel-content">
                    {isGroup ? (
                        <div className="grenade-list">
                            {selectedData.map(g => (
                                <div key={g.id} className="grenade-list-item" onClick={() => onViewDetails(g)}>
                                    <div className="grenade-icon">
                                        <span className={`type-dot ${g.type}`}></span>
                                    </div>
                                    <div className="grenade-info">
                                        <h4>{g.name}</h4>
                                        <p>{g.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grenade-details">
                            <div className="grenade-top-info">
                                <span className="badge">{selectedData.type}</span>
                                {selectedData.throwType && (
                                    <span className={`throw-badge ${selectedData.throwType}`}>
                                        {selectedData.throwType.replace('-', ' ')}
                                    </span>
                                )}
                            </div>
                            
                            <p className="description">{selectedData.content.description}</p>
                            
                            <div className="images-container">
                                {selectedData.content.images && selectedData.content.images.length > 0 ? (
                                    selectedData.content.images.map((src, i) => (
                                        <div key={i} className="image-wrapper" onClick={() => setZoomedImage(src)}>
                                            <img src={src} alt={`Step ${i+1}`} loading="lazy" />
                                            <span className="step-badge">STEP {i+1}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-images">No lineup images available</div>
                                )}
                            </div>
                            
                            <button className="back-btn" onClick={() => onClose()}>Close Selection</button>
                        </div>
                    )}
                </div>
            </div>

            {zoomedImage && (
                <div className="lightbox-overlay" onClick={() => setZoomedImage(null)}>
                    <img src={zoomedImage} alt="Zoomed" className="lightbox-content" />
                </div>
            )}
        </>
    );
};

export default SidePanel;
