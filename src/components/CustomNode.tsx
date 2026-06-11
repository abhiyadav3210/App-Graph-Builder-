import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { 
  Settings, 
  Cpu, 
  Layers, 
  Database, 
  Activity, 
  HardDrive, 
  Globe, 
  AlertTriangle, 
  CheckCircle,
  XCircle 
} from 'lucide-react';
import type { GraphNodeData, NodeStatus, NodeMetricType } from '../api/mockApi';
import { useGraphMutations } from '../hooks/useGraphData';
import { useAppStore } from '../store/useAppStore';

const providerLogos = {
  aws: (
    <svg className="w-8 h-5 text-amber-500 fill-current" viewBox="0 0 24 15">
      <path d="M12 0c-3 0-5.5 1.5-6.8 3.6L3 2.1c2-3.1 5.6-5.1 9-5.1 6.1 0 11 4.5 11 10S18.1 17 12 17c-3.6 0-6.8-1.5-9-4l2.2-1.7C6.5 13.5 9 15 12 15c4.7 0 8.5-3.1 8.5-7S16.7 0 12 0z"/>
      <path d="M4 14.5c4-2 9-2 13 0m-14 0c.5-.5 1-1 2-1.5m12 1.5c-.5-.5-1-1-2-1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  gcp: (
    <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400">
      <span className="text-blue-500 font-extrabold">G</span>
      <span className="text-red-500 font-extrabold">C</span>
      <span className="text-yellow-500 font-extrabold">P</span>
    </div>
  ),
  azure: (
    <div className="flex items-center gap-0.5 text-[9px] font-bold text-sky-400">
      <span className="text-sky-500">❖</span> Azure
    </div>
  )
};

export const CustomNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as GraphNodeData;
  const { updateNodeData } = useGraphMutations();
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  const {
    label,
    type,
    status,
    cost,
    cpu,
    memory,
    disk,
    region,
    activeMetric,
    provider
  } = nodeData;

  const handleMetricToggle = (metric: NodeMetricType, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger node selection or dragging
    updateNodeData(id, { activeMetric: metric });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    if (activeMetric === 'cpu') {
      updateNodeData(id, { cpu: Math.round(newVal) });
    } else if (activeMetric === 'memory') {
      updateNodeData(id, { memory: Math.round(newVal) });
    } else if (activeMetric === 'disk') {
      updateNodeData(id, { disk: Math.round(newVal) });
    } else if (activeMetric === 'region') {
      // Limit region count between 1 and 10
      updateNodeData(id, { region: String(Math.max(1, Math.min(10, Math.round(newVal)))) });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    if (activeMetric === 'cpu') {
      updateNodeData(id, { cpu: Math.min(100, Math.max(0, val)) });
    } else if (activeMetric === 'memory') {
      updateNodeData(id, { memory: Math.min(100, Math.max(0, val)) });
    } else if (activeMetric === 'disk') {
      updateNodeData(id, { disk: Math.min(100, Math.max(0, val)) });
    } else if (activeMetric === 'region') {
      updateNodeData(id, { region: String(Math.min(10, Math.max(1, val))) });
    }
  };

  const getMetricValue = (): number => {
    if (activeMetric === 'cpu') return cpu;
    if (activeMetric === 'memory') return memory;
    if (activeMetric === 'disk') return disk;
    if (activeMetric === 'region') return parseFloat(region) || 1;
    return 0;
  };

  const getMetricMax = (): number => {
    if (activeMetric === 'region') return 10;
    return 100;
  };

  // Status Badge UI configuration
  const getStatusBadge = (statusVal: NodeStatus) => {
    switch (statusVal) {
      case 'healthy':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Success</span>
          </div>
        );
      case 'degraded':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Degraded</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Error</span>
          </div>
        );
    }
  };

  // Get service icon
  const getServiceIcon = () => {
    switch (type) {
      case 'db':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'cache':
        return <Activity className="w-5 h-5 text-pink-400" />;
      case 'service':
      default:
        return <Layers className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div 
      className={`relative w-[340px] bg-[#0f1115] border-2 rounded-xl shadow-2xl transition-all duration-200 ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800 hover:border-gray-700'
      }`}
      onClick={() => setSelectedNodeId(id)}
    >
      {/* Target handle on left (for input connections) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        className="!bg-blue-500"
      />

      {/* Top bar elements */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
            {getServiceIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-200">{label}</h3>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{type}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {cost}
          </span>
          <button 
            className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(id);
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Config Tabs & values */}
      <div className="p-4 space-y-4">
        {/* Metric Values Preview */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 block">CPU</span>
            <span className="text-xs font-medium text-gray-300">{(cpu / 100).toFixed(2)}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 block">Memory</span>
            <span className="text-xs font-medium text-gray-300">{(memory / 20).toFixed(2)} GB</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 block">Disk</span>
            <span className="text-xs font-medium text-gray-300">{disk.toFixed(2)} GB</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-500 block">Region</span>
            <span className="text-xs font-medium text-gray-300">{region}</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg bg-gray-950 p-1 border border-gray-900">
          {(['cpu', 'memory', 'disk', 'region'] as NodeMetricType[]).map((metric) => (
            <button
              key={metric}
              onClick={(e) => handleMetricToggle(metric, e)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold rounded-md transition-all ${
                activeMetric === metric
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {metric === 'cpu' && <Cpu className="w-3 h-3" />}
              {metric === 'memory' && <Layers className="w-3 h-3" />}
              {metric === 'disk' && <HardDrive className="w-3 h-3" />}
              {metric === 'region' && <Globe className="w-3 h-3" />}
              <span className="capitalize">{metric}</span>
            </button>
          ))}
        </div>

        {/* Gradient Slider & Sync Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 flex items-center">
            {/* Custom slider with premium background gradient */}
            <input
              type="range"
              min={activeMetric === 'region' ? 1 : 0}
              max={getMetricMax()}
              value={getMetricValue()}
              onChange={handleSliderChange}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500 via-emerald-400 to-rose-500 accent-white"
            />
          </div>
          <input
            type="number"
            value={activeMetric === 'cpu' || activeMetric === 'memory' 
              ? (activeMetric === 'cpu' ? (cpu / 100).toFixed(2) : (memory / 20).toFixed(2)) 
              : activeMetric === 'disk' 
                ? disk.toFixed(2) 
                : region
            }
            step={activeMetric === 'cpu' || activeMetric === 'memory' ? '0.01' : '1'}
            onChange={handleInputChange}
            className="w-16 bg-black border border-gray-800 rounded px-1.5 py-0.5 text-center text-xs font-semibold text-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Footer Status & Provider */}
      <div className="flex items-center justify-between p-4 border-t border-gray-800/80 bg-gray-950/40 rounded-b-xl">
        {getStatusBadge(status)}
        <div className="opacity-80 hover:opacity-100 transition-opacity">
          {providerLogos[provider || 'aws']}
        </div>
      </div>

      {/* Source handle on right (for output connections) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className="!bg-blue-500"
      />
    </div>
  );
};
export default CustomNode;
