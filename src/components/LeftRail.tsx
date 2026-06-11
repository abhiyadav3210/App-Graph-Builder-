import React from 'react';
import { 
  Database, 
  GitBranch, 
  Terminal, 
  HelpCircle, 
  Settings, 
  Sliders,
  TrendingUp
} from 'lucide-react';

export const LeftRail: React.FC = () => {
  return (
    <aside className="w-16 border-r border-gray-800 bg-[#0b0c0e] flex-col items-center py-4 justify-between hidden sm:flex h-full select-none z-30">
      {/* Top section icon navigation */}
      <div className="flex flex-col items-center gap-6 w-full">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>

        <div className="w-8 h-[1px] bg-gray-800" />

        <button className="p-3 text-blue-500 bg-blue-500/5 border border-blue-500/20 rounded-xl transition-all shadow-md">
          <Database className="w-5 h-5" />
        </button>

        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <GitBranch className="w-5 h-5" />
        </button>

        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <Sliders className="w-5 h-5" />
        </button>

        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <Terminal className="w-5 h-5" />
        </button>

        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom section controls */}
      <div className="flex flex-col items-center gap-4">
        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-3 text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
export default LeftRail;
