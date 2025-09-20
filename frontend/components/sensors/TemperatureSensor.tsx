import { SERVER_API_URL } from "@/config/api";
import { TemperatureSensorProps } from "@/src/utils/Interfaces";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TemperatureSensor({
  sensorId,
  temperature,
  humidity,
  time,
  width,
}: TemperatureSensorProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp >= 25) return "#ef4444";
    if (temp <= 18) return "#3b82f6";
    return "#10b981";
  };
  const [predicted, setPredicted] = useState<false | number>(false);
  const predict = async () => {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/lstm/predict/${sensorId}`);
      const data = await res.json();
      if (data?.prediction !== undefined) {
        setPredicted(
          data.prediction
            ?.reduce((a: number, b: number) => a + b) / data.prediction.length
        );
      }
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  useEffect(() => {
    predict();
  }, []);

  return (
    <View style={[styles.box, { width }]}>
      <Text style={styles.sensorId}>Sensor {sensorId}</Text>
      <Text
        style={[
          styles.temperature,
          { color: getTemperatureColor(temperature) },
        ]}
      >
        {temperature?.toFixed(1)}
        °C
      </Text>
      <Text style={styles.time}>{new Date(time).toLocaleTimeString()}</Text>
      <View style={{ marginTop: 12 }}>
        <Text
          style={{
            color: "#10b981",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
            paddingVertical: 6,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          Next: {predicted !== false ? Number(predicted)?.toFixed(2) : "Loading..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "black",
    borderRadius: 15,
    padding: 16,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  sensorId: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  humidity: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
});
