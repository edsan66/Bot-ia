import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ResultCardProps {
  title: string;
  url: string;
  snippet?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, url, snippet }) => {
  const displayUrl = new URL(url).hostname;

  return (
    <div className="group py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4 rounded-sm bg-black/5 flex items-center justify-center overflow-hidden">
          <img 
            src={`https://www.google.com/s2/favicons?sz=64&domain=${displayUrl}`} 
            alt="" 
            className="w-3 h-3"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xs text-brave-muted truncate max-w-xs">{url}</span>
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block mb-1"
      >
        <h3 className="text-xl text-[#1a0dab] group-hover:underline font-medium leading-tight">
          {title}
        </h3>
      </a>
      <p className="text-sm text-brave-muted leading-relaxed line-clamp-2">
        {snippet || "No description available for this result."}
      </p>
    </div>
  );
};
