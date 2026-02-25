import React from 'react';
import Markdown from 'react-markdown';
import { Sparkles, ChevronRight } from 'lucide-react';

interface AISummaryProps {
  summary: string;
  isLoading?: boolean;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#f8f9fa] border border-brave-border rounded-2xl p-6 mb-8 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-brave-orange" />
          <div className="h-4 w-32 bg-black/5 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-black/5 rounded"></div>
          <div className="h-3 w-5/6 bg-black/5 rounded"></div>
          <div className="h-3 w-4/6 bg-black/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-[#f8f9fa] border border-brave-border rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brave-orange/10 rounded-lg">
            <Sparkles size={18} className="text-brave-orange" />
          </div>
          <h2 className="font-semibold text-brave-text">AI Summarizer</h2>
        </div>
        <button className="text-xs font-medium text-brave-muted hover:text-brave-text flex items-center gap-1 transition-colors">
          Learn more <ChevronRight size={14} />
        </button>
      </div>
      <div className="markdown-body prose prose-sm max-w-none text-brave-text/90">
        <Markdown>{summary}</Markdown>
      </div>
      <div className="mt-4 pt-4 border-t border-brave-border/50 flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-wider font-bold text-brave-muted">Source: Brave Search AI</span>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-5 h-5 rounded bg-white border border-brave-border flex items-center justify-center text-[10px] font-bold text-brave-muted">
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
