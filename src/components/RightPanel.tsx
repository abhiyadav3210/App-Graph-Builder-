import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAppsQuery, useAppGraphQuery, useGraphMutations } from '../hooks/useGraphData';
import { 
  Database, 
  ChevronRight, 
  Settings, 
  Cpu, 
  Layers, 
  HardDrive, 
  Globe, 
  X,
  FileText,
  Activity,
  DollarSign
} from 'lucide-react';
import type { NodeStatus } from '../api/mockApi';

export const RightPanel: React.FC = () => {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);
  const activeInspectorTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useAppStore((state) => state.setActiveInspectorTab);

  // TanStack Queries
  const { data: apps, isLoading: isAppsLoading, isError: isAppsError } = useAppsQuery();
  const { data: graphData } = useAppGraphQuery(selectedAppId);
  const { updateNodeData } = useGraphMutations();

  // Find selected node details from the query cache
  const selectedNode = graphData?.nodes.find((n) => n.id === selectedNodeId);

  // Update node metrics helpers
  const handleMetricChange = (metric: 'cpu' | 'memory' | 'disk' | 'region', value: number) => {
    if (!selectedNodeId) return;
    if (metric === 'cpu') updateNodeData(selectedNodeId, { cpu: value });
    if (metric === 'memory') updateNodeData(selectedNodeId, { memory: value });
    if (metric === 'disk') updateNodeData(selectedNodeId, { disk: value });
    if (metric === 'region') updateNodeData(selectedNodeId, { region: String(value) });
  };

  const renderAppsList = () => {
    if (isAppsLoading) {
      return (
        <div className="space-y-2.5 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-900/50 rounded-xl border border-gray-800/40 animate-pulse" />
          ))}
        </div>
      );
    }

    if (isAppsError) {
      return (
        <div className="p-4 text-center text-xs text-red-400">
          Failed to load apps list.
        </div>
      );
    }

    return (
      <div className="p-4 space-y-2">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">APPLICATIONS</h3>
        <div className="space-y-1">
          {apps?.map((app) => {
            const isActive = app.id === selectedAppId;
            return (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedAppId(app.id);
                  setIsMobilePanelOpen(false); // Close drawer on selection
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                  isActive
                    ? 'bg-blue-600/10 text-white border-blue-500/30'
                    : 'bg-transparent text-gray-400 hover:text-gray-200 border-transparent hover:bg-gray-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border ${
                    isActive ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-gray-950 border-gray-800 text-gray-500'
                  }`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">{app.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-blue-400 translate-x-0.5' : 'text-gray-600 group-hover:text-gray-400'
                }`} />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNodeInspector = () => {
    if (!selectedNode) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500">
          <Settings className="w-10 h-10 text-gray-700 mb-2 animate-spin-slow" />
          <p className="text-xs font-semibold">No Node Selected</p>
          <p className="text-[10px] text-gray-600 mt-1 max-w-[200px]">Select any service node on the canvas to inspect configurations and runtime status.</p>
        </div>
      );
    }

    const { label, type, status, cost, cpu, memory, disk, region, description, provider } = selectedNode.data;

    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Inspector Header */}
        <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-gray-950/20">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
              {type} Node
            </span>
            <h3 className="font-bold text-sm text-white">{label}</h3>
          </div>
          <button 
            onClick={() => setSelectedNodeId(null)}
            className="p-1 text-gray-500 hover:text-white hover:bg-gray-900 rounded-lg border border-transparent hover:border-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-4 py-3 border-b border-gray-850 flex gap-2">
          <button
            onClick={() => setActiveInspectorTab('config')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
              activeInspectorTab === 'config'
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                : 'bg-transparent text-gray-500 hover:text-gray-300 border-transparent hover:bg-gray-900/30'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
          <button
            onClick={() => setActiveInspectorTab('runtime')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
              activeInspectorTab === 'runtime'
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                : 'bg-transparent text-gray-500 hover:text-gray-300 border-transparent hover:bg-gray-900/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Runtime</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Status Pill Badge - Configurable */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Status</label>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => updateNodeData(selectedNode.id, { status: e.target.value as NodeStatus })}
                className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="healthy">Healthy (Success)</option>
                <option value="degraded">Degraded (Warning)</option>
                <option value="down">Down (Error)</option>
              </select>

              {/* Status pill preview */}
              {status === 'healthy' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              )}
              {status === 'degraded' && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
              )}
              {status === 'down' && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
              )}
            </div>
          </div>

          {activeInspectorTab === 'config' ? (
            /* CONFIG PANEL */
            <div className="space-y-4">
              {/* Editable Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>Node Name</span>
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g. Postgres Main"
                />
              </div>

              {/* Description textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Description</label>
                <textarea
                  value={description || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                  className="w-full h-20 bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs font-medium text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Brief description of the service's role in the topology."
                />
              </div>

              {/* Synced Metric Sliders */}
              <div className="border-t border-gray-850 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resource Allocation</h4>
                
                {/* CPU Slider & Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-blue-400" />
                      <span>CPU Cores</span>
                    </span>
                    <span className="text-gray-300 font-bold">{(cpu / 100).toFixed(2)} Cores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={cpu}
                      onChange={(e) => handleMetricChange('cpu', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={(cpu / 100).toFixed(2)}
                      onChange={(e) => handleMetricChange('cpu', Math.min(100, Math.max(0, Math.round(parseFloat(e.target.value) * 100 || 0))))}
                      className="w-16 bg-black border border-gray-800 rounded px-2 py-1 text-xs text-center font-semibold text-gray-200"
                    />
                  </div>
                </div>

                {/* Memory Slider & Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      <span>RAM Allocation</span>
                    </span>
                    <span className="text-gray-300 font-bold">{(memory / 20).toFixed(2)} GB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={memory}
                      onChange={(e) => handleMetricChange('memory', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.01}
                      value={(memory / 20).toFixed(2)}
                      onChange={(e) => handleMetricChange('memory', Math.min(100, Math.max(0, Math.round(parseFloat(e.target.value) * 20 || 0))))}
                      className="w-16 bg-black border border-gray-800 rounded px-2 py-1 text-xs text-center font-semibold text-gray-200"
                    />
                  </div>
                </div>

                {/* Disk Slider & Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-pink-400" />
                      <span>Persistent Disk</span>
                    </span>
                    <span className="text-gray-300 font-bold">{disk.toFixed(2)} GB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={disk}
                      onChange={(e) => handleMetricChange('disk', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={disk.toFixed(2)}
                      onChange={(e) => handleMetricChange('disk', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-16 bg-black border border-gray-800 rounded px-2 py-1 text-xs text-center font-semibold text-gray-200"
                    />
                  </div>
                </div>

                {/* Region Slider & Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-400" />
                      <span>Region Shards</span>
                    </span>
                    <span className="text-gray-300 font-bold">{region} Shards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={region}
                      onChange={(e) => handleMetricChange('region', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <input
                      type="number"
                      min={1}
                      max={10}
                      step={1}
                      value={region}
                      onChange={(e) => handleMetricChange('region', Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 bg-black border border-gray-800 rounded px-2 py-1 text-xs text-center font-semibold text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* RUNTIME PANEL */
            <div className="space-y-4">
              {/* Cost Indicator */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Estimated Cost</span>
                  <div className="flex items-baseline text-white">
                    <span className="text-lg font-extrabold">{cost}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Cloud Provider Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Cloud Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['aws', 'gcp', 'azure'] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => updateNodeData(selectedNode.id, { provider: prov })}
                      className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                        provider === prov
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                          : 'bg-transparent text-gray-500 hover:text-gray-400 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock Logs / Connection metrics */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Live Node Logs</label>
                <div className="bg-black border border-gray-900 rounded-xl p-3 font-mono text-[9px] text-gray-400 space-y-1 h-32 overflow-y-auto">
                  <p><span className="text-emerald-500">INFO</span> [10:40:15] Server boot complete, listener active</p>
                  <p><span className="text-emerald-500">INFO</span> [10:40:22] Connected to database cluster</p>
                  {status === 'healthy' ? (
                    <p><span className="text-emerald-500">INFO</span> [10:41:02] Healthcheck OK: latency 12ms</p>
                  ) : status === 'degraded' ? (
                    <p><span className="text-amber-500">WARN</span> [10:41:12] Thread pool saturated: latency 420ms</p>
                  ) : (
                    <p><span className="text-red-500">CRIT</span> [10:41:18] Host disconnected, terminating workers</p>
                  )}
                  <p><span className="text-gray-600">DEBUG</span> [10:41:25] Garbage collection cycle complete (0.5ms)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main wrapper layout that switches between desktop sidebar and mobile drawer
  return (
    <>
      {/* DESKTOP PANEL (fixed sidebar) */}
      <aside className="w-80 border-l border-gray-800 bg-[#0b0c0e] flex-col divide-y divide-gray-850 hidden lg:flex h-full select-none z-30">
        <div className="h-[45%] flex flex-col min-h-0">
          {renderAppsList()}
        </div>
        <div className="h-[55%] flex flex-col min-h-0">
          {renderNodeInspector()}
        </div>
      </aside>

      {/* MOBILE DRAWER (slide-over) */}
      {isMobilePanelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobilePanelOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-sm h-full bg-[#0b0c0e] border-l border-gray-800 flex flex-col shadow-2xl animate-slide-in">
            <div className="h-[40%] border-b border-gray-850 overflow-y-auto">
              {renderAppsList()}
            </div>
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {renderNodeInspector()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default RightPanel;
