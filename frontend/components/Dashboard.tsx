import { SERVER_API_URL } from "@/config/api";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { SensorData } from "@/src/utils/Interfaces";
import { Workspace } from "@/src/utils/Types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import TemperatureSensor from "./sensors/TemperatureSensor";

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const { currentWorkspace } = useWorkspace();
  const padding = 16;
  const gap = 16;
  const numColumns = width > 768 ? 2 : 1;
  const boxWidth =
    (width - padding * 2 - gap * (numColumns - 1) - 100) / numColumns;

  // Je cherche les données du workspace actuel
  const getWorkspace = async (id: string): Promise<Workspace> => {
    const wsRes = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`);
    if (!wsRes.ok) throw new Error("Failed to fetch workspace data");
    return wsRes.json();
  };

  // Je cherhche les données de chaque capteur
  const getSensors = async (sensors: any[]): Promise<SensorData[]> => {
    // NOTE: pour moi
    // j'utilise Promise.allSettled pour gérer les erreurs individuelles
    // si un fetch échoue, les autres continueront
    // comme ça je peux afficher les données des capteurs qui ont réussi
    const res = await Promise.allSettled(
      (sensors ?? []).map(async (sensor) => {
        const res = await fetch(
          `${SERVER_API_URL}/api/analytics/sensor/${sensor.source_id}`
        );
        if (!res.ok) throw new Error(`Failed to fetch sensor ${sensor.id}`);
        return res.json();
      })
    );
    return res
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  };

  // Query for workspace
  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
  } = useQuery({
    queryKey: ["workspace", currentWorkspace?.id],
    queryFn: () => getWorkspace(currentWorkspace?.id?.toString() || ""),
    enabled: !!currentWorkspace?.id,
    retry: (failureCount, error) => {
      console.log("Workspace retry attempt:", failureCount);
      console.log("Workspace error:", error);
      return failureCount < 3;
    },
    refetchInterval: false,
    refetchIntervalInBackground: true,
  });

  // Query for sensors (after workspace is loaded)
  const {
    data: sensorsData,
    isLoading: isSensorsLoading,
    isError: isSensorsError,
    error: sensorsError,
  } = useQuery({
    queryKey: ["sensors", workspaceData?.sensors],
    queryFn: () => getSensors(workspaceData?.sensors ?? []),
    enabled: !!workspaceData?.sensors,
    retry: (failureCount, error) => {
      console.log("Sensors retry attempt:", failureCount);
      console.log("Sensors error:", error);
      return failureCount < 3;
    },
    refetchInterval: false,
    refetchIntervalInBackground: true,
  });

  const isLoading = isWorkspaceLoading || isSensorsLoading;
  const isError = isWorkspaceError || isSensorsError;
  const error = workspaceError || sensorsError;
  const sensorData = sensorsData;

  console.log("Dashboard workspaceData:", workspaceData);
  console.log("Dashboard sensorData:", sensorsData);

  // const sensorData = data?.sensors;

  // console.log("Dashboard sensorData:", data?.workspace);
  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
        <Text style={[styles.titleDash]}>IoT Dashboard</Text>

        <View style={[styles.box, styles.fullWidthBox]}>
          <Text style={[styles.boxText]}>Raspberry Pi Gateway</Text>
          {isLoading ? (
            <Text style={[styles.statusText]}> Loading...</Text>
          ) : isError ? (
            <Text style={[styles.statusText]}>● Error: {error?.message}</Text>
          ) : (
            <Text style={[styles.statusText]}>● Online</Text>
          )}
        </View>

        {isLoading && (
          <View style={[styles.box, styles.fullWidthBox]}>
            <ActivityIndicator />
            <Text>Loading sensors...</Text>
          </View>
        )}

        {!isLoading && (
          <View style={[styles.grid]}>
            {sensorData?.map((data: any, id: any) => (
              <TemperatureSensor
                key={`${data.source_address}_${id}`}
                sensorId={data.source_address}
                temperature={data.temperature}
                humidity={data.humidity}
                time={data.time}
                width={boxWidth}
              />
            ))}
          </View>
        )}

        <View style={[styles.box, styles.fullWidthBox]}>
          <Text style={[styles.boxText]}>System Status</Text>
          <Text style={[styles.summaryText]}>
            {sensorData?.some((data: any) => data.temperature > 25)
              ? "⚠️ High temperature detected"
              : "✅ All systems normal"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  titleDash: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  box: {
    backgroundColor: "black",
    borderRadius: 15,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidthBox: {
    width: "100%",
    marginBottom: 16,
    minHeight: 120,
  },
  boxText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  summaryText: {
    color: "gray",
    textAlign: "center",
    marginTop: 8,
  },
  statusText: {
    color: "#4ade80",
    fontSize: 14,
    marginTop: 4,
  },
  dataText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  subText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 4,
  },
  timeText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 8,
  },
});