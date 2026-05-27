import React from 'react';
import { AutomationOption } from '../types';
import { cn } from '../utils';

interface AutomationOptionCardProps {
  option: AutomationOption;
  selected: boolean;
  onSelect: () => void;
}

export function AutomationOptionCard({ option, selected, onSelect }: AutomationOptionCardProps) {
  // Format the requires text
  const requiresText = option.requiredFiles.join(' + ');

  return (
    <div
      onClick={onSelect}
      className={cn(
        "cursor-pointer p-4 rounded-xl transition-all flex flex-col text-left h-full min-h-[130px]",
        selected 
          ? "relative bg-white border-2 border-blue-500 shadow-md ring-4 ring-blue-50"
          : "bg-white border border-slate-200 opacity-70 hover:opacity-100 hover:border-blue-300 transition-opacity"
      )}
    >
      <h4 className="text-sm font-bold text-slate-800">{option.label}</h4>
      <p className="text-[11px] text-slate-500 mt-1 mb-4 flex-grow tracking-tight leading-snug break-words">
        {option.description}
      </p>
      
      <div className="flex items-center gap-1.5 mt-auto">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          selected ? "bg-blue-500" : "bg-slate-300"
        )}></div>
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-wider truncate",
          selected ? "text-slate-500" : "text-slate-400"
        )}>
          {requiresText}
        </span>
      </div>
    </div>
  );
}
