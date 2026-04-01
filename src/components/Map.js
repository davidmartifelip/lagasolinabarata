'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
}

function MapBoundsUpdater({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds())
  });

  useEffect(() => {
    if (map) onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

function MapPanner({ selectedStationId, stations }) {
  const map = useMap();
  const stationsRef = useRef(stations);
  
  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

  useEffect(() => {
    if (selectedStationId) {
      const selected = stationsRef.current.find(s => s.station.id === selectedStationId);
      if (selected) {
        map.panTo([selected.station.lat, selected.station.lon], { animate: true, duration: 0.5 });
      }
    }
  }, [selectedStationId, map]);
  return null;
}

export default function Map({ center, stations, userLocation, fuelType, onBoundsChange, selectedStationId, onSelectStation }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      scrollWheelZoom={true}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OSM'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="topright" />
      <MapRecenter center={center} zoom={13} />
      <MapBoundsUpdater onBoundsChange={onBoundsChange} />
      <MapPanner selectedStationId={selectedStationId} stations={stations} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lon]} icon={blueIcon}>
          <Popup><strong>Estás aquí</strong></Popup>
        </Marker>
      )}

      {stations.map((s, index) => {
        const p = s.station;
        const targetPrice = fuelType === '95' ? p.price95 : p.priceGasoilA;
        const formattedPrice = targetPrice ? targetPrice.toFixed(3) : 'N/A';
        
        let isCheapest = index === 0;
        let isSecond = index > 0 && index <= 4;
        let isSelected = p.id === selectedStationId;

        let cssClass = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-600 shadow-md rounded-full px-2 py-1 flex items-center justify-center text-xs whitespace-nowrap w-max';
        if (isSelected) cssClass = 'bg-blue-500 text-white font-bold border-2 border-blue-300 shadow-lg shadow-blue-500/50 rounded-full px-3 py-1 flex items-center justify-center text-sm whitespace-nowrap z-[1100] relative w-max';
        else if (isCheapest) cssClass = 'bg-green-500 text-white font-bold border-2 border-green-300 shadow-lg shadow-green-500/50 rounded-full px-3 py-1 flex items-center justify-center text-sm whitespace-nowrap z-[1000] relative w-max';
        else if (isSecond) cssClass = 'bg-yellow-400 text-yellow-900 font-bold border-2 border-yellow-200 shadow-lg shadow-yellow-400/40 rounded-full px-3 py-1 flex items-center justify-center text-xs whitespace-nowrap z-[900] relative w-max';

        const priceIcon = new L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="${cssClass}">${formattedPrice}</div>`,
          iconSize: [0, 0],
          iconAnchor: [14, 14]
        });

        return (
          <Marker 
            key={p.id} 
            position={[p.lat, p.lon]}
            icon={priceIcon}
            eventHandlers={{
              click: () => onSelectStation(p.id)
            }}
          >
            <Popup className="rounded-xl overflow-hidden shadow-sm">
              <div className="font-sans min-w-[140px] flex flex-col gap-1 p-0.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{p.brand || 'Gasolinera'}</h4>
                <div className="font-extrabold text-green-600 text-base mb-1">
                  {formattedPrice !== 'N/A' ? `${formattedPrice} €` : 'N/A'}
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 !text-white font-bold py-1.5 px-3 rounded-lg transition-colors text-xs shadow-md"
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  📍 Cómo llegar
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
