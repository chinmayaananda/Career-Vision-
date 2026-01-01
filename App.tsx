import React, { useState, useEffect } from 'react';
import UploadArea from './components/UploadArea';
import StyleSelector from './components/StyleSelector';
import { generateCategoryBatch } from './services/geminiService';
import { AlertIcon, CheckCircleIcon, DownloadIcon, RefreshIcon } from './components/Icons';
import { STYLES, CATEGORY_LABELS } from './constants';
import { CategoryId } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('WORK');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('pilot');
  
  // Store results mapped by styleId
  const [results, setResults] = useState<Record<string, string>>({});
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select first style when category changes
  useEffect(() => {
    const firstStyle = STYLES.find(s => s.category === activeCategory);
    if (firstStyle) setSelectedStyleId(firstStyle.id);
  }, [activeCategory]);

  const activeResult = results[selectedStyleId] || null;
  const activeStyle = STYLES.find(s => s.id === selectedStyleId);

  const handleGenerateCategory = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const batchResults = await generateCategoryBatch(selectedImage, activeCategory);
      setResults(prev => ({ ...prev, ...batchResults }));
      
      const firstKey = Object.keys(batchResults)[0];
      if (firstKey) setSelectedStyleId(firstKey);

    } catch (err: any) {
      setError(err.message || "Failed to generate collection. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults({});
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white">
               IF
             </div>
             <h1 className="text-xl font-bold tracking-tight text-white">IdentityForge</h1>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
            Reimagine Yourself
          </h2>
          <p className="text-slate-400 text-lg">
            Generate a complete set of cinematic portraits in one go.
          </p>
        </div>

        {/* Section 1: Upload */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs border border-slate-700">1</span>
              Upload your image
            </h3>
            {selectedImage && (
                <button onClick={handleReset} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                  <RefreshIcon /> Reset All
                </button>
            )}
          </div>
          <UploadArea 
            selectedImage={selectedImage} 
            onImageSelected={setSelectedImage} 
          />
        </section>

        {/* Section 2: Select */}
        <section className="space-y-4">
           <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs border border-slate-700">2</span>
              Select look
            </h3>
          <StyleSelector 
            selectedStyleId={selectedStyleId}
            onStyleSelect={setSelectedStyleId}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            results={results}
            isGenerating={isGenerating}
          />
        </section>

        {/* Generate Button */}
        <div className="py-2">
           <button
            onClick={handleGenerateCategory}
            disabled={!selectedImage || isGenerating}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-xl
              flex items-center justify-center gap-3
              ${!selectedImage 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isGenerating
                  ? 'bg-indigo-900/50 text-indigo-200 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1'
              }
            `}
          >
            {isGenerating ? (
              <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
           {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200 text-sm">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}
        </div>

        {/* Section 3: Result (Labeled Generate) */}
        <section className="space-y-4">
           <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs border border-slate-700">3</span>
              Generate
          </h3>
          
          <div className={`
            w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border-2 relative bg-slate-800 transition-colors duration-300
            ${activeResult ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-slate-800 border-dashed flex items-center justify-center'}
          `}>
            {activeResult ? (
              <img 
                src={activeResult} 
                alt="Transformed Result" 
                className="w-full h-full object-contain bg-black animate-fade-in"
              />
            ) : (
              <div className="text-center p-8 opacity-40">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 animate-pulse"></div>
                <p className="text-slate-400 font-medium">
                  {isGenerating 
                    ? "Processing entire collection..." 
                    : "Select a collection and generate to see results here."}
                </p>
              </div>
            )}

            {/* Overlay Actions */}
            {activeResult && !isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                <a 
                  href={activeResult} 
                  download={`identity-forge-${selectedStyleId}.png`}
                  className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  <DownloadIcon />
                  Download
                </a>
              </div>
            )}
          </div>
          
          {activeResult && (
            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-700">
              <div className="flex items-center gap-3">
                <CheckCircleIcon />
                <div>
                  <h4 className="text-sm font-bold text-white">Complete</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing result for: <span className="text-indigo-400">{activeStyle?.name}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default App;