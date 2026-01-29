import React, { useState } from 'react';
import './Commands.css';

const CommandCard = ({ cmd, category, onCopy, isCopied }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    // Only show placeholder for knife commands (except base) if image hasn't loaded or failed
    const showImageSlot = cmd.image || (category === 'Knife Commands' && cmd.id !== 'knife-base');

    return (
        <div className="command-card">
            {showImageSlot && (
                <div className={`command-image ${imageLoaded ? 'loaded' : ''}`}>
                    {cmd.image && !imageError && (
                        <img 
                            src={cmd.image} 
                            alt={cmd.name} 
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>
            )}
            <div className="command-info">
                <h3>{cmd.name}</h3>
                <div className="command-box">
                    <code>{cmd.command}</code>
                    <button 
                        className={`copy-btn ${isCopied ? 'copied' : ''}`}
                        onClick={() => onCopy(cmd.command, cmd.id)}
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const Commands = ({ commands }) => {
    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categories = [...new Set(commands.map(c => c.category))];

    return (
        <div className="commands-container">
            <div className="commands-header">
                <h1>Utility Commands</h1>
                <p>Quickly copy practice and knife commands to your console.</p>
            </div>

            {categories.map(category => (
                <section key={category} className="command-section">
                    <h2 className="category-title">{category}</h2>
                    <div className="command-grid">
                        {commands.filter(c => c.category === category).map(cmd => (
                            <CommandCard 
                                key={cmd.id} 
                                cmd={cmd} 
                                category={category}
                                onCopy={copyToClipboard}
                                isCopied={copiedId === cmd.id}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Commands;
