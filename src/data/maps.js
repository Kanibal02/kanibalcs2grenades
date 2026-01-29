export const maps = [
  { id: 'de_mirage', name: 'Mirage' },
  { id: 'de_inferno', name: 'Inferno' },
  { id: 'de_dust2', name: 'Dust II' },
  { id: 'de_nuke', name: 'Nuke', hasLayers: true },
  { id: 'de_vertigo', name: 'Vertigo', hasLayers: true },
  { id: 'de_ancient', name: 'Ancient' },
  { id: 'de_anubis', name: 'Anubis' },
  { id: 'de_train', name: 'Train', hasLayers: true },
  { id: 'cs_office', name: 'Office' }
];

export const mapImage = (mapId, layer = 'upper') => {
    const suffix = layer === 'lower' ? '_lower' : '';
    return `/images/cs2maps/${mapId}/${mapId}${suffix}_radar_psd_transparent.png`;
};
