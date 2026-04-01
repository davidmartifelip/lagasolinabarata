'use client';

import { MapPin, Clock } from 'lucide-react';

export default function StationCard({ station, time, highlightPrice, isCheapest, isSecond, isSelected, onClick }) {
  let borderClass = 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700';
  if (isSelected) borderClass = 'glass bg-blue-50/90 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 ring-2 ring-blue-400/50';
  else if (isCheapest) borderClass = 'glass border-green-400 dark:border-green-500 ring-1 ring-green-400/30';
  else if (isSecond) borderClass = 'glass border-yellow-400 dark:border-yellow-500 ring-1 ring-yellow-400/30';

  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`;

  return (
    <div 
      onClick={onClick}
      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${borderClass} hover:shadow-md backdrop-blur-md flex flex-col gap-1`}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-bold text-sm leading-tight truncate mr-2 ${isSelected ? 'text-blue-800 dark:text-blue-200' : 'text-slate-800 dark:text-slate-100'}`}>{station.brand || 'INDEPENDIENTE'}</h3>
        <div className={`px-2 py-0.5 rounded-full text-sm font-bold shadow-sm shrink-0 ${isSelected ? 'bg-blue-500 text-white' : isCheapest ? 'bg-green-500 text-white' : isSecond ? 'bg-yellow-400 text-slate-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
          {highlightPrice ? `${highlightPrice.toFixed(3)} €` : 'N/A'}
        </div>
      </div>
      
      <div className="flex flex-col gap-0.5 text-[10px] sm:text-xs">
        <p className={`flex items-start gap-1 truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="truncate">{station.address}</span>
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium mt-1">
        <span className={`${isSelected ? 'bg-blue-200 text-blue-900 dark:bg-blue-800/40 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'} px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap`}>
          {Math.round(time)} min
        </span>
        <span className={`px-1.5 py-0.5 rounded whitespace-nowrap ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300'}`}>
          <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
          {station.schedule}
        </span>
      </div>

      <div className={`mt-1.5 ${isSelected ? 'block' : 'hidden md:block'}`}>
         <a 
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded transition-colors text-[11px] shadow-sm uppercase tracking-wide"
        >
          📍 Cómo llegar
        </a>
      </div>
    </div>
  );
}
