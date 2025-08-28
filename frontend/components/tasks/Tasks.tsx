import { SERVER_API_URL } from "@/config/api";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// const selectedTasks = [];
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
export default function Tasks({
  allTasks,
  sensor,
  selectedTasks,
  setSelectedTasks,
  closeTaskModel,
}: {
  allTasks: Task[];
  sensor: Sensor;
  selectedTasks: number[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<number[]>>;
  toggleTaskSelection: (taskId: number) => void;
  closeTaskModel: () => void;
}) {
  const { token } = useAuth();
  const [sensorTasks, setSensorTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  const fetchAvailableTasks = async () => {
    console.log("Fetching available tasks...");
    try {
      const response = await fetch(`${SERVER_API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Available tasks fetched:", data);
        setAvailableTasks(data);
      } else {
        console.error("Erreur lors du chargement des tâches");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
    }
  };

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

  const getAvailableTasksForSensor = () => {
    // if (!selectedSensor) return [];

    const associatedTaskIds = sensorTasks?.map((task) => task.id) || [];
    console.log("Associated Task IDs:", associatedTaskIds, sensorTasks);
    const showTasks = availableTasks.filter(
      (task) => !associatedTaskIds.includes(task.id)
    );
    console.log("Show Tasks:", showTasks);
    return showTasks;
  };
  const filteredTasks = getAvailableTasksForSensor();
  console.log("Filtered Tasks:", filteredTasks);
  //   .filter(
  //     (task) =>
  //       task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       task.description.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev: any) => {
      if (prev.includes(taskId)) {
        return prev.filter((id: any) => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };
  useEffect(() => {
    fetchSensorTasks(sensor?.id as any);
    fetchAvailableTasks();
  }, [sensor]);

  return (
    <ScrollView style={styles.tasksContainer}>
      <Text style={styles.sectionTitle}>
        Tâches disponibles ({selectedTasks.length} sélectionnée(s))
      </Text>

      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskItem,
              selectedTasks.includes(task.id) && styles.taskItemSelected,
            ]}
            onPress={() => toggleTaskSelection(task.id)}
          >
            <View style={styles.taskInfo}>
              <Ionicons
                name="list"
                size={24}
                color={
                  selectedTasks.includes(task.id)
                    ? Colors.light.tint
                    : Colors.light.text
                }
              />
              <View style={styles.taskDetails}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={styles.taskStatus}>
                  Statut:{" "}
                  {task.status === "pending"
                    ? "En attente"
                    : task.status === "in_progress"
                      ? "En cours"
                      : "Terminée"}
                </Text>
              </View>
            </View>
            {selectedTasks.includes(task.id) && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors.light.tint}
              />
            )}
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noTasksText}>
          {searchTerm
            ? "Aucune tâche disponible trouvée pour cette recherche"
            : "Aucune tâche disponible pour ce capteur"}
        </Text>
      )}
    </ScrollView>
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
