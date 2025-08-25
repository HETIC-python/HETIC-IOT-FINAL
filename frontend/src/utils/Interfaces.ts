export interface TemperatureSensorProps {
    sensorId: string;
    temperature: number;
    humidity: number;
    time: string;
    width: number;
}

export interface SensorData {
    temperature: number;
    humidity: number;
    battery?: number;
    time: string;
    sensor_id: string;
}