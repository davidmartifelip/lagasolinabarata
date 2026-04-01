'use client';
import { Settings2 } from 'lucide-react';
import StationCard from './StationCard';

export default function StationList({ stations, fuelType, setFuelType, maxTime, setMaxTime, maxPrice, setMaxPrice, selectedStationId, onSelectStation }) {
  
  const isInfinitePrice = maxPrice >= 2.1;
  const displayPrice = isInfinitePrice ? '+2.00 €/L' : `${maxPrice.toFixed(2)} €/L`;

  return (
    <div className="absolute bottom-0 left-0 right-0 md:top-4 md:bottom-auto md:w-[420px] md:left-4 z-[1000] pointer-events-none md:p-0">
      <div className="h-[45vh] md:h-[90vh] lg:h-[95vh] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-t md:border border-white/40 dark:border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl rounded-t-3xl md:rounded-3xl overflow-hidden pointer-events-auto flex flex-col">
        
        {/* Header / Filter Area */}
        <div className="p-4 bg-white/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50 flex flex-col gap-4 shrink-0">
          
          <div className="flex bg-black/5 dark:bg-white/10 p-1.5 rounded-2xl md:rounded-xl backdrop-blur-md border border-white/20 w-full shadow-inner mb-1">
            <button 
              className={`px-4 py-2.5 md:py-2 rounded-xl md:rounded-lg text-sm font-bold transition-all flex-1 ${fuelType === '95' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}`}
              onClick={() => setFuelType('95')}
            >
              Gasolina 95
            </button>
            <button 
              className={`px-4 py-2.5 md:py-2 rounded-xl md:rounded-lg text-sm font-bold transition-all flex-1 ${fuelType === 'A' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}`}
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

        <div className="overflow-y-auto p-4 flex flex-col gap-3 flex-1 custom-scrollbar">
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
              <p className="text-sm mt-2 opacity-80">Prueba a mover el mapa o ajustar el precio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
