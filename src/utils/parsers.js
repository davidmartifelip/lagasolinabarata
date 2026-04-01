/**
 * Parsea un número en formato español (ej. "1,54" o "1,540") a un float.
 */
export function parseSpanishNumber(str) {
  if (!str) return null;
  const parsed = parseFloat(str.replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

/**
 * Recibe el JSON de la API gubernamental y devuelve un array de estaciones más limpio.
 */
export function parseStationsData(data) {
  if (!data?.ListaEESSPrecio) return [];

  return data.ListaEESSPrecio.map(station => ({
    id: station['IDEESS'],
    name: station['Rótulo'],
    address: `${station['Dirección']}, ${station['Localidad']} (${station['Provincia']})`,
    lat: parseSpanishNumber(station['Latitud']),
    lon: parseSpanishNumber(station['Longitud (WGS84)']),
    price95: parseSpanishNumber(station['Precio Gasolina 95 E5']),
    price98: parseSpanishNumber(station['Precio Gasolina 98 E5']),
    priceGasoilA: parseSpanishNumber(station['Precio Gasoleo A']),
    priceGasoilB: parseSpanishNumber(station['Precio Gasoleo B']),
    priceGasoilPremium: parseSpanishNumber(station['Precio Gasoleo Premium']),
    schedule: station['Horario'],
    brand: (station['Rótulo'] || '').toUpperCase()
  })).filter(s => s.lat !== null && s.lon !== null && s.lat !== 0 && s.lon !== 0);
}
