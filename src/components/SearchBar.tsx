import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  className?: string;
  size?: 'sm' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  initialValue = '', 
  className,
  size = 'lg'
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex items-center w-full max-w-3xl transition-all duration-200",
        size === 'lg' ? "h-14" : "h-10",
        className
      )}
    >
      <div className="absolute left-4 text-brave-muted">
        <Search size={size === 'lg' ? 20 : 16} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the web privately..."
        className={cn(
          "w-full h-full pl-12 pr-12 rounded-full border border-brave-border bg-white shadow-sm focus:outline-none focus:border-brave-orange focus:ring-2 focus:ring-brave-orange/10 transition-all",
          size === 'lg' ? "text-lg" : "text-base"
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-4 p-1 text-brave-muted hover:text-brave-text rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={size === 'lg' ? 20 : 16} />
        </button>
      )}
    </form>
  );
};
