import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVER_API_URL } from '../utils/api';

interface Sensor {
  id: number;
  name: string;
  source_id: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  user_id: number;
  sensors: Sensor[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspaceById: (id: number) => void;
  refreshCurrentWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);
WorkspaceContext.displayName = 'WorkspaceContext';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch workspaces');
      
      const data = await response.json();
      setWorkspaces(data);

      if (data.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentWorkspaceById = (id: number) => {
    const workspace = workspaces.find(w => w.id === id);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem('lastWorkspaceId', id.toString());
    }
  };

  const refreshCurrentWorkspace = async () => {
    if (!currentWorkspace) return;
    
    try {
      const token = localStorage.getItem('token');
      console.log('Refreshing workspace with ID:', currentWorkspace.id, currentWorkspace);
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/${currentWorkspace.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to refresh workspace');
      
      const data = await response.json();
      setCurrentWorkspace(data);
      
      // Update workspace in workspaces array
      setWorkspaces(prev => 
        prev.map(w => w.id === data.id ? data : w)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Initial load
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Restore last selected workspace
  useEffect(() => {
    const lastWorkspaceId = localStorage.getItem('lastWorkspaceId');
    if (lastWorkspaceId && workspaces.length > 0) {
      setCurrentWorkspaceById(parseInt(lastWorkspaceId, 10));
    }
  }, [workspaces]);

  const value = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    fetchWorkspaces,
    setCurrentWorkspaceById,
    refreshCurrentWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
