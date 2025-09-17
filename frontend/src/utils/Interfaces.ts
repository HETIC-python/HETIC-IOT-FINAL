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
    source_address: string;
}

export interface CreateWorkspaceModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string }) => Promise<void>;
}


export interface Sensor {
    id: number;
    name: string;
    source_id: string;
}

export interface Workspace {
    id: number;
    user_id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    sensors: Sensor[];
}