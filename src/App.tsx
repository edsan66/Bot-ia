import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { AISummary } from './components/AISummary';
import { Sidebar } from './components/Sidebar';
import { performSearch, SearchResponse, SearchEngine } from './services/searchService';
import { Shield, Settings, Menu, Grid, User, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';

export default function App() {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<SearchEngine>('brave');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalStats, setTotalStats] = useState({
    adsBlocked: 0,
    trackersBlocked: 0,
    timeSaved: 0
  });

  const handleSearch = async (newQuery: string, selectedEngine: SearchEngine = engine) => {
    if (!newQuery) return;
    setQuery(newQuery);
    setIsSearching(true);
    setHasSearched(true);
    setError(null);

    try {
      const response = await performSearch(newQuery, selectedEngine);
      setResults(response);
      
      // Update cumulative stats
      setTotalStats(prev => ({
        adsBlocked: prev.adsBlocked + response.stats.adsBlocked,
        trackersBlocked: prev.trackersBlocked + response.stats.trackersBlocked,
        timeSaved: prev.timeSaved + parseFloat(response.stats.timeSaved)
      }));
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEngineChange = (newEngine: SearchEngine) => {
    setEngine(newEngine);
    if (query) {
      handleSearch(query, newEngine);
    }
  };

  const tabs = ['All', 'Images', 'News', 'Videos', 'Maps', 'Shopping'];

  if (!hasSearched) {
    return (
      <div className="min-h-screen flex flex-col bg-brave-bg">
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-brave-muted">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck size={14} />
                {totalStats.adsBlocked} Ads Blocked
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldCheck size={14} />
                {totalStats.trackersBlocked} Trackers Blocked
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <Shield size={20} />
              </button>
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <Grid size={20} />
              </button>
              <button className="flex items-center gap-2 pl-1 pr-3 py-1 hover:bg-black/5 rounded-full transition-colors border border-brave-border">
                <div className="w-7 h-7 rounded-full bg-brave-orange flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                <span className="text-sm font-medium">Sign in</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-brave-orange rounded-2xl flex items-center justify-center shadow-lg shadow-brave-orange/20">
                <Shield size={40} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight">Brave</h1>
            </div>
            
            <SearchBar onSearch={(q) => handleSearch(q)} />
            
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['brave', 'google', 'yahoo', 'duckduckgo', 'yandex'].map((e) => (
                <button
                  key={e}
                  onClick={() => setEngine(e as SearchEngine)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                    engine === e 
                      ? "bg-brave-orange text-white border-brave-orange shadow-md shadow-brave-orange/20" 
                      : "bg-white text-brave-muted border-brave-border hover:border-brave-orange/50"
                  )}
                >
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
              {['Ad Blocker', 'Tracker Shield', 'Independent Index', 'AI Powered'].map((feature) => (
                <div key={feature} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-black/5 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-brave-orange/10 flex items-center justify-center text-brave-orange">
                    <Shield size={20} />
                  </div>
                  <span className="text-xs font-medium text-brave-muted">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </main>

        <footer className="p-6 flex flex-wrap justify-center gap-8 text-xs text-brave-muted font-medium">
          <a href="#" className="hover:text-brave-text transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brave-text transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brave-text transition-colors">About Brave</a>
          <a href="#" className="hover:text-brave-text transition-colors">Help Center</a>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brave-bg">
      <header className="sticky top-0 z-50 bg-white border-bottom border-brave-border">
        <div className="px-4 py-3 flex items-center gap-4 lg:gap-8">
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => setHasSearched(false)}
          >
            <div className="w-8 h-8 bg-brave-orange rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl tracking-tight">Brave</span>
          </div>
          
          <div className="flex-1 max-w-3xl">
            <SearchBar onSearch={(q) => handleSearch(q)} initialValue={query} size="sm" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-4 mr-4 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <ShieldCheck size={12} />
              Shields Up: {results?.stats.adsBlocked || 0} Ads Blocked
            </div>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
              <Settings size={20} className="text-brave-muted" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <User size={20} className="text-brave-muted" />
            </button>
          </div>
        </div>

        <div className="px-4 lg:px-44 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-brave-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cn(
                "py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                tab === 'All' 
                  ? "border-brave-orange text-brave-text" 
                  : "border-transparent text-brave-muted hover:text-brave-text"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-12">
        <div className="flex-1 max-w-3xl">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <div key="loading" className="space-y-8">
                <AISummary summary="" isLoading={true} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-3 w-32 bg-black/5 rounded"></div>
                    <div className="h-5 w-3/4 bg-black/5 rounded"></div>
                    <div className="h-3 w-full bg-black/5 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div key="error" className="py-12 text-center">
                <Info size={48} className="mx-auto text-brave-orange/20 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-brave-muted mb-6">{error}</p>
                <button 
                  onClick={() => handleSearch(query)}
                  className="px-6 py-2 bg-brave-orange text-white rounded-full font-semibold hover:bg-brave-orange/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {results?.summary && <AISummary summary={results.summary} />}
                
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs text-brave-muted">
                    Showing results from <span className="font-bold text-brave-orange uppercase">{engine}</span> index
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    <ShieldCheck size={10} />
                    {results?.stats.adsBlocked} Ads & {results?.stats.trackersBlocked} Trackers Cleaned
                  </div>
                </div>

                <div className="divide-y divide-brave-border/50">
                  {results?.results.map((result, i) => (
                    <ResultCard 
                      key={i}
                      title={result.title}
                      url={result.url}
                      snippet={result.snippet}
                    />
                  ))}
                  
                  {results?.results.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-brave-muted">No results found for your query.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Sidebar 
          stats={results?.stats} 
          currentEngine={engine} 
          onEngineChange={handleEngineChange} 
        />
      </main>
    </div>
  );
}
