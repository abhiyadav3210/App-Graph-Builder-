import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { useAppStore } from '../store/useAppStore';
import { useAppGraphQuery, useGraphMutations } from '../hooks/useGraphData';
import { Plus, Maximize, AlertCircle, RefreshCw } from 'lucide-react';
import type { GraphNode, GraphEdge } from '../api/mockApi';

export const GraphCanvas: React.FC = () => {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  // TanStack Query to fetch app graph
  const { data: graphData, isLoading, isError, error, refetch } = useAppGraphQuery(selectedAppId);
  const { updateNodes, updateEdges, addNode, deleteNode } = useGraphMutations();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { fitView } = useReactFlow();

  // Define custom node types
  const nodeTypes = useMemo(() => ({
    customNode: CustomNode,
  }), []);

  // Sync ReactFlow local state with react-query graphData when it changes
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      // Wait a frame for ReactFlow to render, then fit view
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
    }
  }, [graphData, setNodes, setEdges, fitView]);

  // Sync local node changes back to the TanStack Query cache
  const onNodesChangeHandler = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    // After applying changes locally, update the cache
    setTimeout(() => {
      setNodes((currentNodes) => {
        updateNodes(currentNodes as GraphNode[]);
        return currentNodes;
      });
    }, 0);
  }, [onNodesChange, setNodes, updateNodes]);

  // Sync local edge changes back to the TanStack Query cache
  const onEdgesChangeHandler = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    setTimeout(() => {
      setEdges((currentEdges) => {
        updateEdges(currentEdges as unknown as GraphEdge[]);
        return currentEdges;
      });
    }, 0);
  }, [onEdgesChange, setEdges, updateEdges]);

  // Connect two nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = { ...params, id: `e-${params.source}-${params.target}`, animated: true } as Edge;
      setEdges((eds) => {
        const updated = addEdge(newEdge, eds);
        updateEdges(updated as unknown as GraphEdge[]);
        return updated;
      });
    },
    [setEdges, updateEdges]
  );

  // Handle selected node deletion with Backspace/Delete keys
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach((node) => {
      deleteNode(node.id);
      if (selectedNodeId === node.id) {
        setSelectedNodeId(null);
      }
    });
  }, [deleteNode, selectedNodeId, setSelectedNodeId]);

  // Canvas background click resets selection
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Fit View function
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 600 });
  }, [fitView]);

  // Add new service node
  const handleAddNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    // Position it randomly near the center of the viewport
    const x = 200 + Math.random() * 200;
    const y = 150 + Math.random() * 150;
    
    const newNode: GraphNode = {
      id,
      type: 'customNode',
      position: { x, y },
      data: {
        label: `New Service ${nodes.length + 1}`,
        type: Math.random() > 0.5 ? 'service' : (Math.random() > 0.5 ? 'db' : 'cache'),
        status: 'healthy',
        cost: '$0.02/HR',
        cpu: 10,
        memory: 20,
        disk: 5,
        region: 'us-east-1',
        activeMetric: 'cpu',
        description: 'Dynamically provisioned microservice layer.',
        provider: Math.random() > 0.6 ? 'gcp' : (Math.random() > 0.3 ? 'azure' : 'aws'),
      },
    };

    addNode(newNode);
    setSelectedNodeId(id);
    
    // Animate view to focus on new node
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 600 });
    }, 100);
  }, [nodes.length, addNode, setSelectedNodeId, fitView]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07080a] text-gray-400 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-semibold tracking-wider animate-pulse">LOADING APPLICATION GRAPH...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07080a] text-red-400 gap-4 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-bold text-gray-200">Failed to load graph</h3>
          <p className="text-xs text-gray-400">{(error as Error)?.message || 'Something went wrong fetching the live architecture.'}</p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-semibold transition-all mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full bg-[#07080a] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="text-white"
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1.5} 
          color="#1b1d24" 
        />
        
        {/* Styled dark controls */}
        <Controls 
          className="!bg-[#0f1115] !border !border-gray-800 !rounded-xl !shadow-2xl overflow-hidden [&_button]:!bg-[#0f1115] [&_button]:!border-gray-800 [&_button]:!text-gray-300 [&_button:hover]:!bg-gray-800 [&_svg]:fill-gray-300"
        />

        {/* Styled dark minimap */}
        <MiniMap 
          className="!bg-[#0f1115] !border !border-gray-800 !rounded-xl !shadow-2xl overflow-hidden hidden md:block"
          nodeColor="#1e293b"
          maskColor="rgba(0, 0, 0, 0.7)"
        />

        {/* Custom floating controls on Canvas */}
        <Panel position="top-right" className="flex items-center gap-2">
          <button
            onClick={handleFitView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0f1115] hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-all shadow-xl"
            title="Fit Graph to Screen"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span>Fit View</span>
          </button>
          
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 border border-blue-500 hover:border-blue-400 text-white transition-all shadow-xl"
            title="Add Node"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
export default GraphCanvas;
