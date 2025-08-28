import { SERVER_API_URL } from "@/config/api";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface Sensor {
  id: number;
  name: string;
}

interface Workspace {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sensors: Sensor[];
}

export default function WorkspacePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
      } else {
        Alert.alert('Erreur', 'Impossible de charger les informations du workspace');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkspace();
    setRefreshing(false);
  };

  const deleteWorkspace = () => {
    console.log('deleteWorkspace called, id:', id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    console.log('Delete confirmed, making API call...');
    try {
      const url = `${SERVER_API_URL}/api/workspaces/${id}`;
      console.log('DELETE URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('DELETE response status:', response.status);
      console.log('DELETE response ok:', response.ok);
      
      if (response.ok) {
        console.log('Workspace deleted successfully');
        setShowDeleteConfirm(false);
        router.back();
      } else {
        const errorText = await response.text();
        console.log('DELETE error response:', errorText);
        setShowDeleteConfirm(false);
        // Fallback to Alert if custom confirm doesn't work
        try {
          Alert.alert('Erreur', `Impossible de supprimer le workspace (${response.status})`);
        } catch (e) {
          console.error('Alert also failed:', e);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setShowDeleteConfirm(false);
      // Fallback to Alert if custom confirm doesn't work
      try {
        Alert.alert('Erreur', 'Problème de connexion au serveur');
      } catch (e) {
        console.error('Alert also failed:', e);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchWorkspace();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!workspace) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workspace non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{workspace.name}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/workspace/${id}/edit`)}>
          <Ionicons name="create-outline" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Workspace Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: workspace.is_active ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>
            {workspace.is_active ? 'Actif' : 'Inactif'}
          </Text>
        </View>
      </View>

      {/* Workspace Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{workspace.description}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Créé le:</Text>
          <Text style={styles.detailValue}>{formatDate(workspace.created_at)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Modifié le:</Text>
          <Text style={styles.detailValue}>{formatDate(workspace.updated_at)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID utilisateur:</Text>
          <Text style={styles.detailValue}>{workspace.user_id}</Text>
        </View>
      </View>

      {/* Sensors Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Capteurs ({workspace.sensors.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push(`/workspace/${id}/add-sensor`)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {workspace.sensors.length > 0 ? (
          workspace.sensors.map((sensor) => (
            <TouchableOpacity 
              key={sensor.id} 
              style={styles.sensorItem}
              onPress={() => router.push(`/workspace/${id}/sensor/${sensor.id}`)}
            >
              <View style={styles.sensorInfo}>
                <Ionicons name="hardware-chip" size={24} color={Colors.light.tint} />
                <Text style={styles.sensorName}>{sensor.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="hardware-chip-outline" size={48} color={Colors.light.text} />
            <Text style={styles.emptyStateText}>Aucun capteur configuré</Text>
            <Text style={styles.emptyStateSubtext}>Ajoutez votre premier capteur pour commencer</Text>
          </View>
        )}
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push(`/workspace`)}
        >
          <Ionicons name="analytics-outline" size={24} color={Colors.light.tint} />
          <Text style={styles.actionButtonText}>Voir les analyses</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/add-task')}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.light.tint} />
          <Text style={styles.actionButtonText}>Ajouter une tâche</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push(`/workspace/${id}/settings`)}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.light.tint} />
          <Text style={styles.actionButtonText}>Paramètres</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={deleteWorkspace}
        >
          <Ionicons name="trash-outline" size={24} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.dangerText]}>Supprimer le workspace</Text>
          <Ionicons name="chevron-forward" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
      {/* Custom Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Supprimer le workspace</Text>
          <Text style={styles.modalMessage}>
            Êtes-vous sûr de vouloir supprimer ce workspace ? Cette action est irréversible.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={() => setShowDeleteConfirm(false)}
            >
              <Text style={styles.modalButtonCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonDelete} 
              onPress={confirmDelete}
            >
              <Text style={styles.modalButtonDeleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
    </ScrollView>

)
  ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.light.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 2,
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: Colors.light.text,
    marginTop: 15,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 5,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 15,
    flex: 1,
    fontWeight: '500',
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  dangerText: {
    color: '#F44336',
  },
  bottomSpacing: {
    height: 100,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  modalButtonCancelText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalButtonDelete: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F44336',
  },
  modalButtonDeleteText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
});
