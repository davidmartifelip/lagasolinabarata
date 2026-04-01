/**
 * Haversine formula to calculate the great-circle distance between two points on a sphere
 * @param {number} lat1 - Latitude of point 1 in decimal degrees
 * @param {number} lon1 - Longitude of point 1 in decimal degrees
 * @param {number} lat2 - Latitude of point 2 in decimal degrees
 * @param {number} lon2 - Longitude of point 2 in decimal degrees
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadian = angle => (Math.PI / 180) * angle;

  const EARTH_RADIUS_KM = 6371;

  const dLat = toRadian(lat2 - lat1);
  const dLon = toRadian(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(lat1)) *
      Math.cos(toRadian(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
