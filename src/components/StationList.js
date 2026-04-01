'use client';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import StationCard from './StationCard';

export default function StationList({ stations, fuelType, setFuelType, maxTime, setMaxTime, maxPrice, setMaxPrice, selectedStationId, onSelectStation }) {
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  const isInfinitePrice = maxPrice >= 2.1;
  const displayPrice = isInfinitePrice ? '+2.00 €/L' : `${maxPrice.toFixed(2)} €/L`;

  const handleTouchStart = (e) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = dragStartY - endY;
    if (diff > 40) setSheetExpanded(true); // Swiped up
    else if (diff < -40) setSheetExpanded(false); // Swiped down
  };

  return (
    <>
      {/* Mobile Top Filters */}
      <div className="absolute top-4 left-4 right-4 z-[1000] md:hidden pointer-events-none">
        <div className="glass bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 flex flex-col gap-2.5 shadow-xl pointer-events-auto border border-white/40 dark:border-slate-700">
          
          {/* Row 1: Fuel & Time */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl shadow-inner flex-1 border border-slate-300/30 dark:border-slate-600/30">
              <button 
                className={`px-1 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 ${fuelType === '95' ? 'bg-green-500 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
                onClick={() => setFuelType('95')}
              >
                G. 95
              </button>
              <button 
                className={`px-1 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 ${fuelType === 'A' ? 'bg-blue-500 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
                onClick={() => setFuelType('A')}
              >
                Diésel
              </button>
            </div>
            
            <select 
              value={maxTime} 
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-200 px-2 py-1.5 rounded-xl shadow-sm h-[32px] shrink-0"
            >
              <option value={5}>&lt; 5 min</option>
              <option value={10}>&lt; 10 min</option>
              <option value={15}>&lt; 15 min</option>
              <option value={30}>&lt; 30 min</option>
              <option value={60}>&lt; 1 h</option>
              <option value={999}>Cualquier tiempo</option>
            </select>
          </div>
          
          {/* Row 2: Price */}
          <div className="flex flex-col gap-1 w-full px-1">
            <div className="flex justify-between items-center leading-none mt-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Precio Máximo</label>
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded">{displayPrice}</span>
            </div>
            <input 
              type="range" min="1.0" max="2.1" step="0.05" 
              value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none accent-green-500 mt-1 mb-1"
            />
          </div>

        </div>
      </div>

      {/* Bottom Sheet wrapper (Mobile 35% height / Desktop sidebar) */}
      <div className={`absolute bottom-0 left-0 right-0 md:top-4 md:bottom-auto md:w-[420px] md:left-4 z-[1000] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`}>
        <div className={`${sheetExpanded ? 'h-[70vh]' : 'h-[35vh]'} md:h-[90vh] lg:h-[95vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t md:border border-slate-200 dark:border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl rounded-t-3xl md:rounded-3xl overflow-hidden pointer-events-auto flex flex-col transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`}>
          
          {/* Mobile Handle */}
          <div 
            className="w-full h-6 flex items-center justify-center md:hidden shrink-0 cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setSheetExpanded(!sheetExpanded)}
          >
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
          </div>

          {/* Desktop Filter Header (Hidden on Mobile) */}
          <div className="hidden md:flex p-4 bg-white/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50 flex-col gap-4 shrink-0">
            <div className="flex bg-black/5 dark:bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/20 w-full shadow-inner mb-1">
              <button 
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 ${fuelType === '95' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}`}
                onClick={() => setFuelType('95')}
              >
                Gasolina 95
              </button>
              <button 
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 ${fuelType === 'A' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}`}
                onClick={() => setFuelType('A')}
              >
                Gasóleo A
              </button>
            </div>

            <div className="flex justify-between items-center px-1">
              <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Resultados del Mapa</h2>
              <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full shadow-sm">
                {stations.length} gasolineras
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 w-full px-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precio Máximo</label>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">{displayPrice}</span>
                </div>
                <input 
                  type="range" min="1.0" max="2.1" step="0.05" 
                  value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} 
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-xl shadow-inner border border-slate-200/50 dark:border-slate-700/50 mx-1">
                 <div className="flex items-center gap-2">
                   <Settings2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">A menos de</span>
                 </div>
                 <select 
                  value={maxTime} 
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-200 px-2 py-1.5 rounded-lg shadow-sm"
                >
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                  <option value={999}>Cualquier</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile List Short Header */}
          <div className="flex md:hidden justify-between items-center px-4 pb-2 shrink-0 border-b border-slate-200 dark:border-slate-700/50">
             <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Resultados en zona</h2>
             <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-2 py-0.5 rounded shadow-sm">{stations.length}</span>
          </div>

          <div className="overflow-y-auto p-4 flex flex-col gap-2.5 flex-1 custom-scrollbar">
            {stations.length > 0 ? stations.map((stationData, index) => (
              <StationCard 
                key={stationData.station.id} 
                station={stationData.station} 
                time={stationData.time} 
                highlightPrice={fuelType === '95' ? stationData.station.price95 : stationData.station.priceGasoilA}
                isCheapest={index === 0}
                isSecond={index > 0 && index <= 4}
                isSelected={stationData.station.id === selectedStationId}
                onClick={() => onSelectStation(stationData.station.id)}
              />
            )) : (
              <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                <span className="text-5xl mb-4 opacity-50">📍</span>
                <p className="font-bold text-lg">No hay resultados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
