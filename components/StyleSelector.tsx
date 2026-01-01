import React, { useMemo } from 'react';
import { STYLES, CATEGORY_LABELS } from '../constants';
import { DynamicIcon } from './Icons';
import { StyleProfile, CategoryId } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string;
  onStyleSelect: (id: string) => void;
  activeCategory: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  results: Record<string, string>;
  isGenerating: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyleId, 
  onStyleSelect, 
  activeCategory,
  onCategoryChange,
  results,
  isGenerating
}) => {
  
  const categories: CategoryId[] = ['WORK'];

  const filteredStyles = useMemo(() => 
    STYLES.filter(s => s.category === activeCategory), 
  [activeCategory]);

  return (
    <div className="w-full space-y-6">
      {/* Category Tabs - Conditional rendering if we add more back later, or just show label for now */}
      {categories.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              disabled={isGenerating}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 disabled:opacity-50'
                }
              `}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Styles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredStyles.map((style: StyleProfile) => {
          const isSelected = selectedStyleId === style.id;
          const hasResult = !!results[style.id];

          return (
            <div
              key={style.id}
              onClick={() => onStyleSelect(style.id)}
              className={`
                relative cursor-pointer rounded-xl p-4 border transition-all duration-200
                flex flex-col items-center text-center space-y-3
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                }
              `}
            >
              {hasResult && (
                <div className="absolute top-2 right-2 text-green-400 bg-slate-900/50 rounded-full p-0.5 z-10">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
              
              <div className={`
                p-3 rounded-full 
                ${isSelected ? 'bg-indigo-500 text-white' : hasResult ? 'bg-slate-700 text-indigo-400' : 'bg-slate-700 text-slate-300'}
              `}>
                <DynamicIcon name={style.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {style.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {style.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;