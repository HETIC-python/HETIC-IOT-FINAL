import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER_API_URL } from "../../utils/api";

interface Sensor {
  id: number;
  name: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  sensors: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

function SensorSelect({
  workspaceId,
  onSensorAdded,
}: {
  workspaceId: string;
  onSensorAdded: () => void;
}) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAvailableSensors();
  }, []);

  const fetchAvailableSensors = async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/sensors`);
      if (!response.ok) throw new Error("Failed to fetch sensors");
      const data = await response.json();
      setSensors(data);
    } catch (error) {
      console.error("Error fetching sensors:", error);
    }
  };

  const filteredSensors = sensors.filter((sensor) =>
    sensor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSensorAdd = async (sensorId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_API_URL}/api/workspaces/${workspaceId}/sensors/${sensorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to add sensor");
      onSensorAdded();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding sensor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Add Sensor
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search sensors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredSensors.map((sensor) => (
              <button
                key={sensor.id}
                onClick={() => handleSensorAdd(sensor.id)}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {sensor.name}
              </button>
            ))}
            {filteredSensors.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No sensors found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`);
        if (!response.ok) throw new Error("Failed to fetch workspace");
        const data = await response.json();
        setWorkspace(data);
      } catch (error) {
        setError("Error loading workspace");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [id]);

  const refreshWorkspace = () => {
    // Logic to refresh workspace data
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-error/10 text-error p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{workspace.name}</h1>
              <p className="text-gray-600">{workspace.description}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                workspace.is_active
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {workspace.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Connected Sensors</h2>
              {workspace && (
                <SensorSelect
                  workspaceId={workspace.id.toString()}
                  onSensorAdded={refreshWorkspace}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspace.sensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium">{sensor.name}</h3>
                  <p className="text-sm text-gray-500">
                    Sensor ID: {sensor.id}
                  </p>
                </div>
              ))}
              {workspace.sensors.length === 0 && (
                <p className="text-gray-500 col-span-2 text-center py-8">
                  No sensors connected to this workspace yet
                </p>
              )}
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between text-sm text-gray-500">
              <p>
                Created: {new Date(workspace.created_at).toLocaleDateString()}
              </p>
              <p>
                Last updated:{" "}
                {new Date(workspace.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
