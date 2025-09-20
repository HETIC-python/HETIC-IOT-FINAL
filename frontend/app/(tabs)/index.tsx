import Dashboard from "@/components/Dashboard";
import { NotSignedIn } from "@/components/NotSignedIn";
import { SERVER_API_URL } from "@/config/api";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { CreateWorkspaceModalProps, Workspace as WorkspaceType } from "@/src/utils/Interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../src/components/Header";
import { useAuth } from "../../src/context/AuthContext";

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

function ListWorkspace({ items }: { items: WorkspaceType[] }) {
  const { setCurrentWorkspace } = useWorkspace();
  const router = useRouter();
  return (
    <View className="flex-row flex-wrap gap-2 p-2">
      {items.map((workspace) => (
        <TouchableOpacity
          key={workspace.id}
          onPress={() => setCurrentWorkspace(workspace)}
          onLongPress={() => router.push(`/workspace/${workspace.id}`)}
          className="bg-white rounded-lg p-2 flex-row items-center"
        >
          <Text className="text-sm font-medium mr-2">{workspace.name}</Text>
          <Text className="text-xs text-gray-500">→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

async function getWorkspaces(token: string): Promise<WorkspaceType[]> {
  const res = await fetch(`${SERVER_API_URL}/api/workspaces`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – fetch workspaces failed: ${text}`);
  }
  return res.json();
}

async function createWorkspaceApi(
  token: string,
  payload: { name: string; description: string }
): Promise<void> {
  const res = await fetch(`${SERVER_API_URL}/api/workspaces`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} – create failed`);
  }
}

export default function Workspace() {
  const { token, isSignedIn } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: workspaces = [],
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery<WorkspaceType[]>({
    queryKey: ["workspaces", token],
    queryFn: () => getWorkspaces(token ?? ""),
    enabled: !!token, 
    // refetchInterval: 30_000,
    // refetchIntervalInBackground: true,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      createWorkspaceApi(token ?? "", data),
    onSuccess: () => {
      // rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["workspaces", token] });
    },
  });

  const handleCreateWorkspace = async (data: {
    name: string;
    description: string;
  }) => {
    await createMutation.mutateAsync(data);
  };

  if (!isSignedIn) {
    return <NotSignedIn />;
  }

  if (!isLoading && workspaces.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 p-4"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <Header title="My Workspaces" />
          <View className="p-4 flex-col items-center justify-center">
            <Text className="text-base text-gray-600 text-center mb-4">
              You have no workspaces yet.
            </Text>
            <Text className="text-base text-gray-600 text-center mb-4">
              Say you have ordered a device on sent-io.com, you can create your
              first workspace to get started.
            </Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-blue-500 px-6 py-3 rounded-full"
            >
              <Text
                className="text-white font-semibold"
                onPress={() => Linking.openURL("https://sent-io.site")}
              >
                Create Workspace
              </Text>
            </TouchableOpacity>
          </View>

          <CreateWorkspaceModal
            isVisible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateWorkspace}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Header title="My Workspaces" />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0072ff" />
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">
              {error instanceof Error ? error.message : "Error fetching workspaces"}
            </Text>
          </View>
        ) : (
          <>
            {/* Liste cliquable */}
            <ListWorkspace items={workspaces} />
            <ScrollView className="flex-1 p-4">
              <Dashboard />
            </ScrollView>
          </>
        )}

        <CreateWorkspaceModal
          isVisible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkspace}
        />
      </ScrollView>
    </View>
  );
}
