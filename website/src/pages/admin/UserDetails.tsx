import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { SERVER_API_URL } from "../../utils/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  workspaces: number[];
}

interface Workspace {
  id: number;
  name: string;
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, workspacesResponse] = await Promise.all([
          fetch(`${SERVER_API_URL}/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch(`${SERVER_API_URL}/api/workspaces`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        ]);

        if (!userResponse.ok || !workspacesResponse.ok) throw new Error("Failed to fetch data");
        
        const userData = await userResponse.json();
        const workspacesData = await workspacesResponse.json();
        
        setUser(userData);
        setWorkspaces(workspacesData);
        setSelectedWorkspaces(userData.workspaces || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleWorkspaceUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${SERVER_API_URL}/api/users/${id}/workspaces`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ workspaces: selectedWorkspaces }),
      });

      if (!response.ok) throw new Error('Failed to update workspaces');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Users
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-gray-900">{user.role}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Workspaces
          </label>
          <Select
            isMulti
            options={workspaces.map(workspace => ({
              value: workspace.id,
              label: workspace.name
            }))}
            value={workspaces
              .filter(w => selectedWorkspaces.includes(w.id))
              .map(w => ({ value: w.id, label: w.name }))}
            onChange={(selected) => {
              setSelectedWorkspaces(selected ? selected.map(option => option.value) : []);
            }}
            className="mb-4"
          />
          <button
            onClick={handleWorkspaceUpdate}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
          >
            {isSaving ? 'Saving...' : 'Save Workspace Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
