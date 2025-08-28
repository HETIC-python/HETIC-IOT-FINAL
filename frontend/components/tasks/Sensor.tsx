import { SERVER_API_URL } from "@/config/api";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Task {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
}
export interface Sensor {
  id: number;
  name: string;
  status: string;
  workspace_id: number;
  workspace_name: string;
  tasks?: Task[];
}
export function Sensor({
  sensor,
  openTaskModal,
}: {
  sensor: any;
  openTaskModal: (sensor: any) => void;
}) {
  const { token, user } = useAuth();
  const [sensorTasks, setSensorTasks] = useState<Task[]>([]);
  const fetchSensorTasks = async (sensorId: number) => {
    try {
      const response = await fetch(
        `${SERVER_API_URL}/api/sensors/${sensorId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour le capteur avec ses tâches
        setSensorTasks(data.tasks || []);
        console.log("Tâches du capteur:", data.tasks);
        return data;
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches du capteur:", error);
    }
    return [];
  };
  useEffect(() => {
    if (sensor.id) {
      fetchSensorTasks(sensor.id);
    }
  }, [sensor]);
  return (
    <View key={sensor.id} style={styles.sensorItem}>
      <View style={styles.sensorInfo}>
        <Ionicons name="hardware-chip" size={24} color={Colors.light.text} />
        <View style={styles.sensorDetails}>
          <Text style={styles.sensorName}>{sensor.name}</Text>
          <Text style={styles.sensorWorkspace}>{sensor.workspace_name}</Text>

          {/* Affichage des tâches associées */}
          {sensorTasks && sensorTasks.length > 0 && (
            <View style={styles.associatedTasks}>
              <Text style={styles.associatedTasksTitle}>
                Tâches associées ({sensorTasks.length}):
              </Text>
              {sensorTasks.map((task) => (
                <Text key={task.id} style={styles.associatedTask}>
                  • {task.name} (
                  {task.status === "pending"
                    ? "En attente"
                    : task.status === "in_progress"
                      ? "En cours"
                      : "Terminée"}
                  )
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.sensorActions}>
        <View
          style={[
            styles.sensorStatus,
            {
              backgroundColor:
                sensor.status === "active" ? "#4CAF50" : "#F44336",
            },
          ]}
        >
          <Text style={styles.sensorStatusText}>
            {sensor.status === "active" ? "Actif" : "Inactif"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => openTaskModal(sensor)}
        >
          <Ionicons name="add-circle" size={20} color={Colors.light.tint} />
          <Text style={styles.addTaskButtonText}>
            {sensor.tasks && sensor.tasks.length > 0 ? "Ajouter" : "Associer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  userInfo: {
    padding: 20,
    backgroundColor: Colors.light.tint,
    margin: 20,
    borderRadius: 12,
  },
  userInfoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  sensorsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 20,
  },
  sensorItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sensorInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  sensorDetails: {
    marginLeft: 15,
    flex: 1,
  },
  sensorName: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  sensorWorkspace: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  associatedTasks: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  associatedTasksTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  associatedTask: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
    marginLeft: 8,
  },
  sensorActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sensorStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sensorStatusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  addTaskButtonText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: "500",
    marginLeft: 6,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "white",
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: Colors.light.text,
  },
  tasksContainer: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  taskItemSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: "#F0F8FF",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  taskDetails: {
    marginLeft: 15,
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontStyle: "italic",
  },
  noTasksText: {
    textAlign: "center",
    color: Colors.light.text,
    opacity: 0.6,
    fontStyle: "italic",
    marginTop: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "white",
  },
  associateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  associateButtonDisabled: {
    opacity: 0.6,
  },
  associateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
  },
});
