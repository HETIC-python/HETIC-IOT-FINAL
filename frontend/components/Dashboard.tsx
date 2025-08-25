import { SERVER_API_URL } from "@/config/api";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import TemperatureSensor from "./sensors/TemperatureSensor";

interface SensorData {
  temperature: number;
  humidity: number;
  battery?: number;
  time: string;
  sensor_id: number;
}

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const padding = 16;
  const gap = 16;
  const numColumns = width > 768 ? 2 : 1;
  const boxWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({
    jiad: {
      temperature: 22,
      humidity: 60,
      battery: 80,
      time: "2023-10-01T12:00:00Z",
      sensor_id: 1042691358,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  const getWorkspaceData = async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/5`);
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
    const fetchSensorData = async () => {
      try {
        // Fetch data for each sensor (assuming IDs 1, 2, 3 for Ruuvi tags)
        const sensorIds = [1042691358, 1042691359, 1042691360];
        const workspace = await getWorkspaceData();
        if (!workspace) {
          console.error("Failed to fetch workspace data");
          return;
        }
        const data = await Promise.all(
          workspace?.sensors.map(async (id: string) => {
            try {
              const response = await fetch(
                `${SERVER_API_URL}/api/analytics/sensor/${id}`
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

        const newSensorData: Record<string, SensorData> = {};
        data.forEach((sensorInfo, index) => {
          newSensorData[sensorIds[index]] = sensorInfo;
        });

        console.log(newSensorData, data);
        setSensorData(newSensorData);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
        <Text style={[styles.titleDash]}>IoT Dashboard</Text>

        {/* Raspberry Pi Status */}
        <View style={[styles.box, styles.fullWidthBox]}>
          <Text style={[styles.boxText]}>Raspberry Pi Gateway</Text>
          <Text style={[styles.statusText]}>● Online</Text>
        </View>

        {/* Temperature Sensors Grid */}
        <View style={[styles.grid]}>
          {Object.entries(sensorData).map(([sensorId, data]) => (
            <TemperatureSensor
              key={sensorId}
              sensorId={sensorId}
              temperature={data.temperature}
              humidity={data.humidity}
              time={data.time}
              width={boxWidth}
            />
          ))}
        </View>

        {/* System Status */}
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
