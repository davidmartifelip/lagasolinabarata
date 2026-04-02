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

/**
 * Estimates driving time based on linear distance, factoring in road detour and traffic speeds.
 * @param {number} linearDistanceKm - The linear distance in kilometers
 * @returns {number} Estimated time in minutes
 */
export function estimateDrivingTime(linearDistanceKm) {
  if (linearDistanceKm <= 0) return 0;
  
  const roadDistanceKm = linearDistanceKm * 1.35;
  let avgSpeedKmh = 30;
  
  if (linearDistanceKm < 2) {
    avgSpeedKmh = 20; 
  } else if (linearDistanceKm < 5) {
    avgSpeedKmh = 25;
  } else if (linearDistanceKm < 15) {
    avgSpeedKmh = 40;
  } else {
    avgSpeedKmh = 70;
  }
  
  const timeMinutes = (roadDistanceKm / avgSpeedKmh) * 60;
  return timeMinutes + 1.5;
}
