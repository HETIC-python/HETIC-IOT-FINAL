import { SERVER_API_URL } from "@/config/api";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { SensorData } from "@/src/utils/Interfaces";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import TemperatureSensor from "./sensors/TemperatureSensor";
type Sensor = {
  id: number;
  name: string;
  source_id: string;
};
export default function Dashboard() {
  const { width } = useWindowDimensions();
  const { currentWorkspace } = useWorkspace();
  const padding = 16;
  const gap = 16;
  const numColumns = width > 768 ? 2 : 1;
  const boxWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getWorkspaceData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workspace data");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      return null;
    }
  };

  useEffect(() => {
    if(!currentWorkspace) return;
    console.log("workspace changed", currentWorkspace)
    const fetchSensorData = async () => {
      try {
        const sensorIds = [1042691358, 1042691359, 1042691360];
        const workspace = await getWorkspaceData(
          currentWorkspace?.id?.toString() || ""
        );
        if (!workspace) {
          console.error("Failed to fetch workspace data");
          return;
        }
        const data = await Promise.all(
          workspace?.sensors.map(async (id: Sensor) => {
            try {
              console.log(id);
              const response = await fetch(
                `${SERVER_API_URL}/api/analytics/sensor/${id.source_id}`
              );
              if (!response.ok) {
                console.error(
                  `Failed to fetch sensor ${id}: ${response.status}`
                );
                return {};
              }
              return await response.json();
            } catch (error) {
              console.error(`Error fetching sensor ${id}:`, error);
              return {};
            }
          })
        );

        console.log(data);

        // const newSensorData = {};
        // data.forEach((sensorInfo, index) => {
        //   newSensorData[sensorIds[index]] = sensorInfo;
        // });

        // console.log(newSensorData, data);
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000);

    return () => clearInterval(interval);
  }, [currentWorkspace]);

  return (
    <View style={[styles.container]}>
      <ScrollView
      contentContainerStyle={[styles.scrollContainer]}
      horizontal={false}
      showsVerticalScrollIndicator={true}
      >
      <Text style={[styles.titleDash]}>IoT Dashboard</Text>

      <View style={[styles.box, styles.fullWidthBox]}>
        <Text style={[styles.boxText]}>Raspberry Pi Gateway</Text>
        <Text style={[styles.statusText]}>● Online</Text>
      </View>
      <View style={[styles.grid]}>
        {sensorData.map((data, id) => (
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

      <View style={[styles.box, styles.fullWidthBox]}>
        <Text style={[styles.boxText]}>System Status</Text>
        <Text style={[styles.summaryText]}>
        {Object.values(sensorData).some((data) => data.temperature > 25)
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
