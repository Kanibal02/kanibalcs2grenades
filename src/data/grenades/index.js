import anubis from './de_anubis.json';

// Map of file -> mapId
const dataSources = {
    'de_anubis': anubis,
    // Add other maps here as you create files
    // 'de_mirage': mirage,
};

const processedGrenades = [];

// Helper to slugify text for IDs
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

Object.entries(dataSources).forEach(([mapId, grenades]) => {
    grenades.forEach(g => {
        // Auto-generate ID if missing: "map-name-side"
        // e.g. "de_anubis" + "CT Smoke" -> "anubis-ct-smoke"
        const cleanMapName = mapId.replace('de_', '');
        const generatedId = g.id || `${cleanMapName}-${slugify(g.name)}`;

        processedGrenades.push({
            ...g,
            map: mapId, // Inject map ID
            id: generatedId
        });
    });
});

export default processedGrenades;
