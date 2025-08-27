import { SERVER_API_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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

interface WorkspaceContextData {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextData | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch workspaces");

      const data = await response.json();
      setWorkspaces(data);

      if (data.length > 0 && !currentWorkspace) {
        const lastWorkspaceId = await AsyncStorage.getItem("lastWorkspaceId");
        const lastWorkspace = lastWorkspaceId
          ? data.find((w: any) => w.id === parseInt(lastWorkspaceId, 10))
          : data[0];
        setCurrentWorkspace(lastWorkspace || data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const setWorkspaceAndSave = async (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    await AsyncStorage.setItem("lastWorkspaceId", workspace.id.toString());
  };

  const refreshWorkspace = async () => {
    if (!currentWorkspace) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${SERVER_API_URL}/api/workspaces/${currentWorkspace.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to refresh workspace");

      const data = await response.json();
      setCurrentWorkspace(data);
      setWorkspaces((prev) => prev.map((w) => (w.id === data.id ? data : w)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        error,
        fetchWorkspaces,
        setCurrentWorkspace: setWorkspaceAndSave,
        refreshWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
