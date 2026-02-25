import React from 'react';
import { ShieldCheck, Lock, EyeOff, BarChart3, Search } from 'lucide-react';
import { SearchEngine } from '../services/searchService';
import { cn } from '../utils';

interface SidebarProps {
  stats?: {
    adsBlocked: number;
    trackersBlocked: number;
    timeSaved: string;
  };
  currentEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats, currentEngine, onEngineChange }) => {
  const engines: { id: SearchEngine; name: string; icon: string }[] = [
    { id: 'brave', name: 'Brave', icon: '🦁' },
    { id: 'google', name: 'Google', icon: 'G' },
    { id: 'yahoo', name: 'Yahoo', icon: 'Y' },
    { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆' },
    { id: 'yandex', name: 'Yandex', icon: 'Ya' },
  ];

  const privacyStats = [
    { icon: ShieldCheck, label: 'Ads blocked', value: stats?.adsBlocked || 0, color: 'text-emerald-600' },
    { icon: Lock, label: 'Trackers blocked', value: stats?.trackersBlocked || 0, color: 'text-blue-600' },
    { icon: EyeOff, label: 'Time saved', value: stats?.timeSaved || '0.0s', color: 'text-orange-600' },
  ];

  return (
    <div className="hidden lg:block w-80 shrink-0 space-y-6">
      <div className="bg-white border border-brave-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search size={20} className="text-brave-orange" />
          <h3 className="font-semibold text-sm">Search Engine</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => onEngineChange(engine.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                currentEngine === engine.id 
                  ? "bg-brave-orange/10 text-brave-orange border border-brave-orange/20" 
                  : "hover:bg-black/5 text-brave-muted border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm text-[10px]">
                  {engine.icon}
                </span>
                {engine.name}
              </div>
              {currentEngine === engine.id && <div className="w-1.5 h-1.5 rounded-full bg-brave-orange" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-brave-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-brave-orange" />
          <h3 className="font-semibold text-sm">Brave Shields</h3>
        </div>
        <div className="space-y-4">
          {privacyStats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <stat.icon size={16} className="text-brave-muted" />
                <span className="text-xs text-brave-muted">{stat.label}</span>
              </div>
              <span className={stat.color + " text-sm font-bold"}>{stat.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-brave-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-brave-muted">Shields Status</span>
            <span className="text-[10px] font-bold uppercase text-emerald-600">Active</span>
          </div>
          <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-brave-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-brave-orange" />
          <h3 className="font-semibold text-sm">Safe Browsing</h3>
        </div>
        <p className="text-[11px] text-brave-muted leading-relaxed mb-4">
          Brave blocks ads and trackers that follow you around the web. Your data is never sold.
        </p>
        <button className="w-full py-2 bg-black/5 hover:bg-black/10 rounded-lg text-xs font-semibold transition-colors">
          Settings
        </button>
      </div>
    </div>
  );
};
