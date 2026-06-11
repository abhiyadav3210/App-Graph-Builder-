import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchApps, 
  fetchAppGraph, 
  updateLiveNode, 
  updateLiveNodes,
  updateLiveEdges,
  addLiveNode
} from '../api/mockApi';
import type { 
  GraphData, 
  GraphNode, 
  GraphEdge, 
  GraphNodeData 
} from '../api/mockApi';
import { useAppStore } from '../store/useAppStore';

export const useAppsQuery = () => {
  return useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: Infinity, // static apps list
  });
};

export const useAppGraphQuery = (appId: string) => {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: () => fetchAppGraph(appId),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false,
  });
};

export const useGraphMutations = () => {
  const queryClient = useQueryClient();
  const selectedAppId = useAppStore((state) => state.selectedAppId);

  const updateNodeData = (nodeId: string, dataUpdates: Partial<GraphNodeData>) => {
    // 1. Update live DB
    updateLiveNode(selectedAppId, nodeId, dataUpdates);

    // 2. Update TanStack Query Cache
    queryClient.setQueryData<GraphData>(['graph', selectedAppId], (old) => {
      if (!old) return old;
      return {
        ...old,
        nodes: old.nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...dataUpdates } } : n
        ),
      };
    });
  };

  const updateNodes = (nodes: GraphNode[]) => {
    updateLiveNodes(selectedAppId, nodes);
    queryClient.setQueryData<GraphData>(['graph', selectedAppId], (old) => {
      if (!old) return old;
      return { ...old, nodes };
    });
  };

  const updateEdges = (edges: GraphEdge[]) => {
    updateLiveEdges(selectedAppId, edges);
    queryClient.setQueryData<GraphData>(['graph', selectedAppId], (old) => {
      if (!old) return old;
      return { ...old, edges };
    });
  };

  const addNode = (node: GraphNode) => {
    addLiveNode(selectedAppId, node);
    queryClient.setQueryData<GraphData>(['graph', selectedAppId], (old) => {
      if (!old) return old;
      return {
        ...old,
        nodes: [...old.nodes, node],
      };
    });
  };

  const deleteNode = (nodeId: string) => {
    queryClient.setQueryData<GraphData>(['graph', selectedAppId], (old) => {
      if (!old) return old;
      
      const newNodes = old.nodes.filter((n) => n.id !== nodeId);
      const newEdges = old.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      
      updateLiveNodes(selectedAppId, newNodes);
      updateLiveEdges(selectedAppId, newEdges);

      return {
        nodes: newNodes,
        edges: newEdges,
      };
    });
  };

  return {
    updateNodeData,
    updateNodes,
    updateEdges,
    addNode,
    deleteNode,
  };
};
