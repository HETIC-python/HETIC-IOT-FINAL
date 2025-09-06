import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { SERVER_API_URL } from "../../utils/api";

export interface User {
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
  const queryClient = useQueryClient();
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<number | null>(
    null
  );

  // Fetch user details
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`${SERVER_API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    enabled: !!id, // Only fetch if `id` is defined
  });

  // Fetch all workspaces
  const { data: workspaces, isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      return response.json();
    },
  });

  // Fetch user workspaces
  const { data: userWorkspaces, isLoading: isUserWorkspacesLoading } = useQuery(
    {
      queryKey: ["userWorkspaces", id],
      queryFn: async () => {
        const response = await fetch(
          `${SERVER_API_URL}/api/admin/users/${id}/workspaces`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user workspaces");
        return response.json();
      },
    }
  );

  // Mutation to update user workspaces
  const updateWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId: number | null) => {
      const response = await fetch(
        `${SERVER_API_URL}/api/users/${id}/workspaces`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ workspace_id: workspaceId }),
        }
      );
      if (!response.ok) throw new Error("Failed to update workspaces");
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces", id] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const handleWorkspaceUpdate = () => {
    updateWorkspaceMutation.mutate(selectedWorkspaces);
  };

  if (isUserLoading || isWorkspacesLoading || isUserWorkspacesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const filteredWorkspaces = workspaces?.filter(
    (workspace: Workspace) =>
      userWorkspaces?.data?.some((uw: Workspace) => uw.id === workspace.id) ===
      false
  );
  console.log(
    "Filtered Workspaces:",
    filteredWorkspaces,
    userWorkspaces,
    workspaces
  );

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Users
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="mt-1 text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <p className="mt-1 text-gray-900">{user.role}</p>
          </div>
        </div>

        <div className="mb-6">
          <p>User's Workspaces:</p>
          <div className="flex flex-col">
            {userWorkspaces?.data?.map((workspace: Workspace) => (
              <Link key={workspace.id} to={`/admin/workspaces/${workspace.id}`}>
                {workspace.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Workspaces
          </label>
          <Select
            options={
              Array.isArray(filteredWorkspaces)
                ? filteredWorkspaces.map((workspace: Workspace) => ({
                    value: workspace.id,
                    label: workspace.name,
                  }))
                : []
            }
            value={
              Array.isArray(workspaces)
                ? workspaces
                    .filter((w: Workspace) => selectedWorkspaces === w.id)
                    .map((w: Workspace) => ({
                      value: w.id,
                      label: w.name,
                    }))[0] || null
                : null
            }
            onChange={(selected: { value: number; label: string } | null) => {
              setSelectedWorkspaces(selected ? selected.value : null);
            }}
            className="mb-4"
            isClearable
          />
          <button
            onClick={handleWorkspaceUpdate}
            disabled={updateWorkspaceMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
          >
            {updateWorkspaceMutation.isPending
              ? "Saving..."
              : "Save Workspace Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
