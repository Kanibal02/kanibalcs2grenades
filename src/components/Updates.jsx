import React from 'react';
import './Updates.css';

const Updates = ({ updates }) => {
    return (
        <div className="updates-container">
            <div className="updates-header">
                <h1>Update Logs</h1>
                <p>Track the evolution of the guide.</p>
            </div>

            <div className="updates-timeline">
                {updates.map((update, index) => (
                    <div key={update.version} className="update-entry">
                        <div className="update-marker">
                            <div className="dot"></div>
                            {index !== updates.length - 1 && <div className="line"></div>}
                        </div>
                        
                        <div className="update-card">
                            <div className="update-card-header">
                                <div className="version-pill">{update.version}</div>
                                <span className="update-date">{update.date}</span>
                            </div>
                            
                            <h2 className="update-title">{update.title}</h2>
                            <p className="update-description">{update.description}</p>
                            
                            <ul className="change-list">
                                {update.changes.map((change, i) => (
                                    <li key={i}>{change}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Updates;
