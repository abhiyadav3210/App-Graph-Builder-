import { create } from 'zustand';

interface AppState {
  selectedAppId: string;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: 'config' | 'runtime';
  setSelectedAppId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAppId: 'supertokens-golang',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }), // Reset selected node when app changes
  setSelectedNodeId: (id) => set((state) => ({ 
    selectedNodeId: id,
    // Auto-open mobile drawer if we select a node on mobile
    isMobilePanelOpen: id ? true : state.isMobilePanelOpen 
  })),
  setIsMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}));
