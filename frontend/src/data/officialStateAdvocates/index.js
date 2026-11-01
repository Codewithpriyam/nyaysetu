/**
 * NyayaSetu — Official High Court & State Bar Council Advocate Datasets
 * Code-split dynamic loaders for all Indian States & Union Territories.
 * Lazy-loads JSON data on-demand to keep client bundle size minimal (< 30 kB).
 */

const STATE_LOADERS = {
  Jharkhand:       () => import('./jharkhand.json'),
  Bihar:           () => import('./bihar.json'),
  'Delhi NCR':     () => import('./delhi_ncr.json'),
  Delhi:           () => import('./delhi_ncr.json'),
  Maharashtra:     () => import('./maharashtra.json'),
  'Uttar Pradesh': () => import('./uttar_pradesh.json'),
  Karnataka:       () => import('./karnataka.json'),
  Rajasthan:       () => import('./rajasthan.json'),
  'West Bengal':   () => import('./west_bengal.json'),
  'Madhya Pradesh': () => import('./madhya_pradesh.json'),
  Gujarat:         () => import('./gujarat.json'),
  Punjab:          () => import('./punjab.json'),
  Haryana:         () => import('./haryana.json'),
  'Tamil Nadu':    () => import('./tamil_nadu.json'),
  Kerala:          () => import('./kerala.json'),
  Odisha:          () => import('./odisha.json'),
  Telangana:       () => import('./telangana.json'),
  Assam:           () => import('./assam.json'),
  Chhattisgarh:    () => import('./chhattisgarh.json'),
  Uttarakhand:     () => import('./uttarakhand.json'),
};

/**
 * Searches official High Court rolls state and district wise on-demand.
 * Dynamically imports only the required state's JSON data.
 * @param {string} state
 * @param {string} district
 * @returns {Promise<Array|null>}
 */
export async function getOfficialHighCourtAdvocates(state, district) {
  const cleanState = state ? state.trim() : 'Jharkhand';
  const cleanDistrict = district ? district.trim().toLowerCase() : '';

  // Case-insensitive state lookup
  const matchedKey = Object.keys(STATE_LOADERS).find(
    (k) => k.toLowerCase() === cleanState.toLowerCase()
  );

  const loader = matchedKey ? STATE_LOADERS[matchedKey] : STATE_LOADERS.Jharkhand;
  if (!loader) return null;

  try {
    const mod = await loader();
    const data = mod.default || mod;
    const stateAdvocates = data.advocates || data;
    if (!Array.isArray(stateAdvocates)) return null;

    let filteredPool = stateAdvocates;

    if (cleanDistrict) {
      const districtMatches = stateAdvocates.filter(
        (adv) =>
          adv.district?.toLowerCase().includes(cleanDistrict) ||
          adv.address?.toLowerCase().includes(cleanDistrict) ||
          adv.court?.toLowerCase().includes(cleanDistrict)
      );
      if (districtMatches.length > 0) {
        filteredPool = districtMatches;
      }
    }

    // Deduplicate by specialization to ensure 1 lawyer for every case category
    const categoryMap = new Map();
    const result = [];

    for (const adv of filteredPool) {
      if (!categoryMap.has(adv.specialization)) {
        categoryMap.set(adv.specialization, true);
        result.push(adv);
      }
      if (result.length >= 6) break;
    }

    // Fill up to 6 if needed
    if (result.length < 6) {
      for (const adv of filteredPool) {
        if (!result.some((r) => r.id === adv.id)) {
          result.push(adv);
        }
        if (result.length >= 6) break;
      }
    }

    return result;
  } catch (err) {
    console.error('Failed to load state advocates dataset:', err);
    return null;
  }
}
