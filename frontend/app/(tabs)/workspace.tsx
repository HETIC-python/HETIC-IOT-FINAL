import Dashboard from "@/components/Dashboard";
import { SERVER_API_URL } from "@/config/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Header } from "../../src/components/Header";
import { useAuth } from "../../src/context/AuthContext";

type Workspace = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

interface CreateWorkspaceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
}

function CreateWorkspaceModal({
  isVisible,
  onClose,
  onSubmit,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      if (!name.trim() || !description.trim()) {
        setError("Name and description are required");
        return;
      }
      setIsLoading(true);
      await onSubmit({ name, description });
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      setError("Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <View className="bg-white w-[90%] max-w-md rounded-2xl p-4 mx-4">
        <Text className="text-xl font-bold mb-4">Create New Workspace</Text>

        {error && <Text className="text-error text-sm mb-4">{error}</Text>}

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <TextInput
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
              value={name}
              onChangeText={setName}
              placeholder="Enter workspace name"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Description
            </Text>
            <TextInput
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter workspace description"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View className="flex-row justify-end items-center mt-6 space-x-3">
          <TouchableOpacity onPress={onClose} className="px-4 py-2">
            <Text className="text-gray-600">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">
              {isLoading ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();
      console.log(data);
      setWorkspaces(data);
    } catch (error: any) {
      setError("Error fetching workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create workspace");
      fetchWorkspaces();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleWorkspacePress = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="My Workspaces" />

      {/* <View className="p-4 flex-row justify-end">
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          className="bg-blue-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-medium">Create New</Text>
        </TouchableOpacity>
      </View> */}

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0072ff" />
        </View>
      ) : workspaces.length === 0 ? (
        // <View className="flex-1 justify-center items-center px-4 -mt-16">
        //   <Text className="text-base text-gray-600 text-center mb-4">
        //     No workspaces available. Create your first workspace to get started.
        //   </Text>
        //   <TouchableOpacity
        //     onPress={() => setShowCreateModal(true)}
        //     className="bg-blue-500 px-6 py-3 rounded-full"
        //   >
        //     <Text className="text-white font-semibold">Create Workspace</Text>
        //   </TouchableOpacity>
        // </View>
        <Dashboard />
      ) : (
        <View>
          <Dashboard />

          {/* <FlatList
            data={workspaces}
            keyExtractor={(item) => item.id}
            contentContainerClassName="p-4"
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white rounded-xl mb-3 p-4 shadow-sm border border-gray-100 active:opacity-70"
                onPress={() => handleWorkspacePress(item.id)}
              >
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {item.name}
                </Text>
                {item.description && (
                  <Text className="text-gray-600 text-sm">
                    {item.description}
                  </Text>
                )}
                <View className="flex-row items-center mt-2">
                  <Text className="text-sm text-gray-500">
                    {(item as any)?.sensors?.length || 0} sensors
                  </Text>
                  <Text className="text-primary-500 ml-auto">
                    View Dashboard →
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          /> */}
        </View>
      )}

      <CreateWorkspaceModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWorkspace}
      />
    </View>
  );
}