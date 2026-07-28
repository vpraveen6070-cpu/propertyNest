// Client-side stateful favourites manager for local and deployed static site

const STORAGE_KEY = 'estate_favourites';

export function getSavedFavouriteIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Default initial saved favourites
      const initial = [1, 2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [1, 2];
  } catch (e) {
    return [1, 2];
  }
}

export function isPropertySaved(id) {
  const ids = getSavedFavouriteIds();
  return ids.includes(Number(id));
}

export function toggleSavedFavourite(id) {
  const numId = Number(id);
  let ids = getSavedFavouriteIds();
  let isSaved = false;

  if (ids.includes(numId)) {
    ids = ids.filter(i => i !== numId);
    isSaved = false;
  } else {
    ids.push(numId);
    isSaved = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Dispatch custom event so components can update reactively
    window.dispatchEvent(new Event('estate_favourites_updated'));
  } catch (e) {}

  return isSaved;
}

export function getSavedFavouriteProperties(allProperties = []) {
  const ids = getSavedFavouriteIds();
  return allProperties.filter(p => ids.includes(Number(p.id)));
}
