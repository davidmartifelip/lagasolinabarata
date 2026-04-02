'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { parseStationsData } from '@/utils/parsers';
import { calculateDistance } from '@/utils/distance';

import StationList from '@/components/StationList';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 absolute inset-0 z-0">
      <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
      <span className="text-slate-500 font-bold">Cargando Mapa...</span>
    </div>
  )
});

const MADRID_CENTER = [40.4168, -3.7038];

export default function Home() {
  const [allStations, setAllStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(MADRID_CENTER);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedStationId, setSelectedStationId] = useState(null);
  
  const [fuelType, setFuelType] = useState('95'); // '95' or 'A'
  const [maxTime, setMaxTime] = useState(999); // min
  const [maxPrice, setMaxPrice] = useState(2.1); // EUR limit default

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Gas Stations Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gas-stations');
        if (!res.ok) throw new Error('Error en llamada a API');
        const data = await res.json();
        const parsed = parseStationsData(data);
        setAllStations(parsed);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos de gasolineras.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Request Geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setMapCenter([latitude, longitude]);
        },
        (err) => {
          console.warn('Geolocation denied or error:', err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Set Bounds Handler
  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  // Selection Handler
  const handleSelectStation = useCallback((id) => {
    setSelectedStationId(id);
  }, []);

  // 3. Filter and Sort
  const filteredStations = useMemo(() => {
    if (allStations.length === 0) return [];

    let mapped = allStations;
    
    // Bounds filter
    if (mapBounds) {
      const { lat: swLat, lng: swLng } = mapBounds.getSouthWest();
      const { lat: neLat, lng: neLng } = mapBounds.getNorthEast();
      mapped = mapped.filter(s => {
        return s.lat >= swLat && s.lat <= neLat && s.lon >= swLng && s.lon <= neLng;
      });
    }

    // Process variables
    mapped = mapped.map(station => {
      let time = 0;
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lon,
          station.lat, station.lon
        );
        time = distance * 1.2;
      }
      return { station, time };
    });

    // Filter limits
    const filtered = mapped.filter(item => {
      // 999 represents 'Any Time/Infinite', so don't filter if maxTime >= 999
      if (userLocation && maxTime < 999 && item.time > maxTime) return false;
      const price = fuelType === '95' ? item.station.price95 : item.station.priceGasoilA;
      if (!price || price <= 0 || price > maxPrice) return false;
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      // Prioritize selected station
      if (a.station.id === selectedStationId) return -1;
      if (b.station.id === selectedStationId) return 1;

      const priceA = fuelType === '95' ? a.station.price95 : a.station.priceGasoilA;
      const priceB = fuelType === '95' ? b.station.price95 : b.station.priceGasoilA;
      return priceA - priceB;
    });

    return filtered;
  }, [allStations, userLocation, maxTime, maxPrice, fuelType, mapBounds, selectedStationId]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      <div className="absolute inset-0 z-0">
        <Map 
          center={mapCenter} 
          stations={filteredStations} 
          userLocation={userLocation} 
          fuelType={fuelType}
          onBoundsChange={handleBoundsChange}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
        />
      </div>

      {(loading || error || !userLocation) && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm">
          <div className="glass p-6 rounded-3xl flex flex-col items-center max-w-sm text-center shadow-2xl">
            {loading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-green-600 dark:text-green-400 mb-4" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Descargando precios...</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Conectando con el Ministerio de Transición Ecológica.</p>
              </>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
            ) : !userLocation ? (
              <>
                <div className="text-5xl mb-4">📍</div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                  Esperando ubicación...
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Por favor, permite el acceso a tu posición en el navegador para encontrar las gasolineras más baratas cerca de ti.</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Lists */}
      {!loading && (userLocation || mapBounds) && (
        <StationList 
          stations={filteredStations} 
          fuelType={fuelType} 
          setFuelType={setFuelType}
          maxTime={maxTime}
          setMaxTime={setMaxTime}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
        />
      )}
    </main>
  );
}
