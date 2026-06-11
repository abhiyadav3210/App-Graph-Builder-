import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import TopBar from './components/TopBar';
import LeftRail from './components/LeftRail';
import GraphCanvas from './components/GraphCanvas';
import RightPanel from './components/RightPanel';

// Create TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen w-screen bg-[#07080a] text-gray-200 overflow-hidden">
          {/* Top Bar Layout Component */}
          <TopBar />

          {/* Core Content Area */}
          <div className="flex flex-1 min-h-0 relative">
            {/* Left Rail Icon Navigation */}
            <LeftRail />

            {/* Central ReactFlow Graph Canvas */}
            <main className="flex-1 h-full min-w-0 relative">
              <GraphCanvas />
            </main>

            {/* Right App / Node Inspector Sidebar & Mobile Drawer */}
            <RightPanel />
          </div>
        </div>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
};

export default App;
