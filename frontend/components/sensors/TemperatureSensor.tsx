import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TemperatureSensorProps {
  sensorId: string;
  temperature: number;
  humidity: number;
  time: string;
  width: number;
}

export default function TemperatureSensor({ sensorId, temperature, humidity, time, width }: TemperatureSensorProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp >= 25) return '#ef4444';
    if (temp <= 18) return '#3b82f6';
    return '#10b981';
  };

  return (
    <View style={[styles.box, { width }]}>
      <Text style={styles.sensorId}>Sensor {sensorId}</Text>
      <Text style={[styles.temperature, { color: getTemperatureColor(temperature) }]}>
        {temperature?.toFixed(1)}°C
      </Text>
      <Text style={styles.humidity}>{humidity?.toFixed(1)}% RH</Text>
      <Text style={styles.time}>{new Date(time).toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 16,
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorId: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  humidity: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
});