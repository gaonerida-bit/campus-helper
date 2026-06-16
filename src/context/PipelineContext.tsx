'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';

// ============= Types =============
export interface PipelineNode {
  id: string;
  name: string;
  order: number;
  color: string;
  icon: string;
  type: 'screening' | 'test' | 'interview' | 'offer' | 'other';
  isDefault: boolean;
}

interface PipelineState {
  nodes: PipelineNode[];
  isHydrated: boolean;
}

type Action =
  | { type: 'HYDRATE'; payload: PipelineNode[] }
  | { type: 'ADD_NODE'; payload: PipelineNode }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: Partial<PipelineNode> } }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'REORDER_NODES'; payload: PipelineNode[] }
  | { type: 'RESET_TO_DEFAULT' };

// ============= Default Nodes =============
const defaultNodes: PipelineNode[] = [
  { id: 'default-1', name: '未投递', order: 0, color: '#94a3b8', icon: '📥', type: 'other', isDefault: true },
  { id: 'default-2', name: '投递', order: 1, color: '#3b82f6', icon: '📤', type: 'screening', isDefault: true },
  { id: 'default-3', name: '筛选', order: 2, color: '#8b5cf6', icon: '🔍', type: 'screening', isDefault: true },
  { id: 'default-4', name: '笔试', order: 3, color: '#06b6d4', icon: '✏️', type: 'test', isDefault: true },
  { id: 'default-5', name: '一面', order: 4, color: '#f59e0b', icon: '🎯', type: 'interview', isDefault: true },
  { id: 'default-6', name: '二面', order: 5, color: '#f97316', icon: '🎯', type: 'interview', isDefault: true },
  { id: 'default-7', name: '三面', order: 6, color: '#ef4444', icon: '🎯', type: 'interview', isDefault: true },
  { id: 'default-8', name: 'HR面', order: 7, color: '#ec4899', icon: '🤝', type: 'interview', isDefault: true },
  { id: 'default-9', name: '签约', order: 8, color: '#10b981', icon: '📝', type: 'offer', isDefault: true },
  { id: 'default-10', name: 'offer', order: 9, color: '#22c55e', icon: '🎉', type: 'offer', isDefault: true },
  { id: 'default-11', name: '拒绝', order: 10, color: '#64748b', icon: '❌', type: 'other', isDefault: true },
];

const STORAGE_KEY = 'campus-helper-pipeline-nodes';

// ============= Initial State =============
const initialState: PipelineState = {
  nodes: defaultNodes,
  isHydrated: false,
};

// ============= Reducer =============
function pipelineReducer(state: PipelineState, action: Action): PipelineState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        nodes: action.payload.length > 0 ? action.payload : defaultNodes,
        isHydrated: true,
      };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.id ? { ...node, ...action.payload.data } : node
        ),
      };
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
      };
    case 'REORDER_NODES':
      return { ...state, nodes: action.payload };
    case 'RESET_TO_DEFAULT':
      return { ...state, nodes: defaultNodes };
    default:
      return state;
  }
}

// ============= Context =============
interface PipelineContextType {
  state: PipelineState;
  dispatch: React.Dispatch<Action>;
  nodes: PipelineNode[];
  addNode: (data: Omit<PipelineNode, 'id' | 'order'>) => PipelineNode;
  updateNode: (id: string, data: Partial<PipelineNode>) => void;
  deleteNode: (id: string) => void;
  reorderNodes: (nodes: PipelineNode[]) => void;
  resetToDefault: () => void;
  getNodeByName: (name: string) => PipelineNode | undefined;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

// ============= Storage Functions =============
function loadFromStorage(): PipelineNode[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(nodes: PipelineNode[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  } catch (e) {
    console.error('Failed to save pipeline nodes:', e);
  }
}

// ============= Provider =============
export function PipelineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = loadFromStorage();
    dispatch({ type: 'HYDRATE', payload: persisted });
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (state.isHydrated) {
      saveToStorage(state.nodes);
    }
  }, [state]);

  const generateId = useCallback(() => {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addNode = useCallback((data: Omit<PipelineNode, 'id' | 'order'>) => {
    const maxOrder = Math.max(...state.nodes.map(n => n.order), -1);
    const node: PipelineNode = {
      ...data,
      id: generateId(),
      order: maxOrder + 1,
    };
    dispatch({ type: 'ADD_NODE', payload: node });
    return node;
  }, [dispatch, generateId, state.nodes]);

  const updateNode = useCallback((id: string, data: Partial<PipelineNode>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, data } });
  }, [dispatch]);

  const deleteNode = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NODE', payload: id });
  }, [dispatch]);

  const reorderNodes = useCallback((nodes: PipelineNode[]) => {
    dispatch({ type: 'REORDER_NODES', payload: nodes });
  }, [dispatch]);

  const resetToDefault = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
  }, [dispatch]);

  const getNodeByName = useCallback((name: string) => {
    return state.nodes.find(n => n.name === name);
  }, [state.nodes]);

  return (
    <PipelineContext.Provider value={{
      state,
      dispatch,
      nodes: state.nodes,
      addNode,
      updateNode,
      deleteNode,
      reorderNodes,
      resetToDefault,
      getNodeByName,
    }}>
      {children}
    </PipelineContext.Provider>
  );
}

// ============= Hook =============
export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within PipelineProvider');
  }
  return context;
}
