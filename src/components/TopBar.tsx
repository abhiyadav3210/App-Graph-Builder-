import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Network, 
  Share2, 
  Sun, 
  Moon, 
  AlertOctagon, 
  Menu, 
  ChevronRight,
  Database
} from 'lucide-react';
import { setTriggerErrorOnce } from '../api/mockApi';

export const TopBar: React.FC = () => {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorSimulated, setErrorSimulated] = useState(false);

  const handleSimulateError = () => {
    setTriggerErrorOnce(true);
    setErrorSimulated(true);
    setTimeout(() => setErrorSimulated(false), 3000);
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-[#0b0c0e]/80 backdrop-blur-md flex items-center justify-between px-4 z-40 relative">
      {/* Brand logo & mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60"
          onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Network className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide m-0">NetGraph</h1>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Canvas Architect</p>
          </div>
        </div>

        {/* Selected app indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 font-semibold ml-4">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>App:</span>
          <span className="text-white font-bold">{selectedAppId}</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Error simulation button */}
        <button
          onClick={handleSimulateError}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            errorSimulated 
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:border-yellow-500/30'
          }`}
          title="Simulate loading failure on next app change"
        >
          <AlertOctagon className={`w-3.5 h-3.5 ${errorSimulated ? 'animate-bounce' : ''}`} />
          <span className="hidden md:inline">Simulate Error</span>
        </button>

        {/* Share Button */}
        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 border border-transparent hover:border-gray-800 transition-all">
          <Share2 className="w-4 h-4" />
        </button>

        {/* Theme toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 border border-transparent hover:border-gray-800 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] cursor-pointer shadow-lg shadow-purple-500/10">
          <img
            src="https://api.dicebear.com/7.x/pixel-art/svg?seed=antigravity"
            alt="Avatar"
            className="w-full h-full rounded-full bg-[#0b0c0e]"
          />
        </div>
      </div>
    </header>
  );
};
export default TopBar;
