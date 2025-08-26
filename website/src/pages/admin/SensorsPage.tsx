import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { SERVER_API_URL } from "../../utils/api";

interface Sensor {
  id: number;
  name: string;
  status: string;
  workspace_id: number;
}

interface Workspace {
  id: number;
  name: string;
}

interface CreateSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateSensorModal({ isOpen, onClose, onSuccess }: CreateSensorModalProps) {
  const [name, setName] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${SERVER_API_URL}/api/workspaces`);
        if (!response.ok) throw new Error("Failed to fetch workspaces");
        const data = await response.json();
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    if (isOpen) {
      fetchWorkspaces();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) {
      alert("Please select a workspace");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_API_URL}/api/sensors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          workspace_id: workspaceId,
          status: "active",
          source_id: sourceId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create sensor");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Sensor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sensor Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Id
            </label>
            <input
              type="text"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workspace
            </label>
            <Select
              options={workspaces.map(workspace => ({
                value: workspace.id,
                label: workspace.name
              }))}
              onChange={(option) => setWorkspaceId(option ? option.value : null)}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Select a workspace"
              isClearable
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isLoading ? "Creating..." : "Create Sensor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchSensors = async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/sensors`);
      if (!response.ok) throw new Error("Failed to fetch sensors");
      const data = await response.json();
      setSensors(data);
    } catch (error) {
      setError("Failed to load sensors");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Sensors</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Sensor
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workspace
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sensor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sensor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sensor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sensor.workspace_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateSensorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchSensors();
        }}
      />
    </div>
  );
}
