import { Sensor } from "@/components/tasks/Sensor";
import Tasks from "@/components/tasks/Tasks";
import { SERVER_API_URL } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useAuth } from "../src/context/AuthContext";

interface Sensor {
  id: number;
  name: string;
  status: string;
  workspace_id: number;
  workspace_name: string;
  tasks?: Task[];
}

interface Task {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

interface UserSensors {
  user_id: number;
  username: string;
  sensors: Sensor[];
  total_sensors: number;
}

export default function AddTaskPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [userSensors, setUserSensors] = useState<UserSensors | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form fields
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const fetchUserSensors = async () => {
    console.log("Fetching user sensors...");
    try {
      setLoading(true);
      if (!user?.id) {
        console.log("User not logged in");
        Alert.alert("Erreur", "Utilisateur non connecté");
        router.push("/sign-in");
        return;
      }

      const response = await fetch(
        `${SERVER_API_URL}/api/user/${user.id}/sensors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserSensors(data);
      } else {
        Alert.alert("Erreur", "Impossible de charger vos capteurs");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des capteurs:", error);
      Alert.alert("Erreur", "Problème de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

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
        setUserSensors((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sensors: prev.sensors.map((sensor) =>
              sensor.id === sensorId ? { ...sensor, tasks: data.tasks } : sensor
            ),
          };
        });
        return data.tasks;
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches du capteur:", error);
    }
    return [];
  };

  const openTaskModal = async (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setSelectedTasks([]);
    setSearchTerm("");

    // Charger les tâches du capteur s'il n'en a pas déjà
    if (!sensor.tasks) {
      await fetchSensorTasks(sensor.id);
    }

    setTaskModalVisible(true);
  };

  const closeTaskModal = () => {
    setTaskModalVisible(false);
    setSelectedSensor(null);
    setSelectedTasks([]);
    setSearchTerm("");
  };

  const associateTasksToSensor = async () => {
    if (submitting === true) return;
    if (!selectedSensor || selectedTasks.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins une tâche");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${SERVER_API_URL}/api/sensors/${selectedSensor.id}/tasks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_ids: selectedTasks,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Succès", "Tâches associées au capteur avec succès", [
          {
            text: "OK",
            onPress: () => {
              // Recharger les capteurs pour mettre à jour les tâches
              fetchUserSensors();
              closeTaskModal();
            },
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Erreur",
          errorData.message || "Impossible d'associer les tâches"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'association des tâches:", error);
      Alert.alert("Erreur", "Problème de connexion au serveur");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  // Filtrer les tâches disponibles (exclure celles déjà associées au capteur sélectionné)
  const getAvailableTasksForSensor = () => {
    if (!selectedSensor) return [];

    const associatedTaskIds =
      selectedSensor.tasks?.map((task) => task.id) || [];
    return availableTasks.filter(
      (task) => !associatedTaskIds.includes(task.id)
    );
  };

  const filteredTasks = getAvailableTasksForSensor().filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    Promise.all([
      fetchUserSensors(),
      fetchAvailableTasks(),
      user?.id ? fetchSensorTasks(user.id) : Promise.resolve([]),
    ]).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Chargement de vos capteurs...</Text>
      </View>
    );
  }

  if (!userSensors || userSensors.total_sensors === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="hardware-chip-outline"
          size={64}
          color={Colors.light.text}
        />
        <Text style={styles.emptyTitle}>Aucun capteur trouvé</Text>
        <Text style={styles.emptySubtitle}>
          Vous devez d'abord créer des workspaces et y ajouter des capteurs
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Gérer les tâches des capteurs</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>
          Bonjour {userSensors.username} ! Vous avez {userSensors.total_sensors}{" "}
          capteur(s)
        </Text>
      </View>

      {/* Sensors List */}
      <ScrollView style={styles.sensorsContainer}>
        <Text style={styles.sectionTitle}>Vos capteurs</Text>

        {userSensors.sensors.map((sensor) => (
          <Sensor
            key={sensor.id}
            sensor={sensor}
            openTaskModal={openTaskModal}
          />
        ))}
      </ScrollView>

      {/* Task Selection Modal */}
      <Modal
        visible={taskModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeTaskModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTaskModal}
            >
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Tâches pour {selectedSensor?.name}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Rechercher des tâches disponibles..."
              placeholderTextColor="#999"
            />
          </View>

          <Tasks
              selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            allTasks={availableTasks}
            sensor={selectedSensor as Sensor}
            toggleTaskSelection={toggleTaskSelection}
            closeTaskModel={closeTaskModal}
          />

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.associateButton,
                selectedTasks.length === 0 && styles.associateButtonDisabled,
              ]}
              onPress={associateTasksToSensor}
              disabled={selectedTasks.length === 0 || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="link" size={20} color="white" />
                  <Text style={styles.associateButtonText}>
                    Associer {selectedTasks.length} tâche(s)
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
