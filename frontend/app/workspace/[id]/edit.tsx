import { SERVER_API_URL } from "@/config/api";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

interface Workspace {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sensors: any[];
}

export default function EditWorkspacePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
        // Populate form fields
        setName(data.name);
        setDescription(data.description);
        setIsActive(data.is_active);
      } else {
        Alert.alert('Erreur', 'Impossible de charger les informations du workspace');
        router.back();
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const saveWorkspace = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom du workspace est obligatoire');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erreur', 'La description du workspace est obligatoire');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${SERVER_API_URL}/api/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          is_active: isActive,
          updated_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Workspace mis à jour avec succès', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert('Erreur', errorData.message || 'Impossible de mettre à jour le workspace');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    Alert.alert(
      'Annuler les modifications',
      'Êtes-vous sûr de vouloir annuler ? Toutes les modifications seront perdues.',
      [
        { text: 'Continuer l\'édition', style: 'cancel' },
        {
          text: 'Annuler',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  useEffect(() => {
    if (id) {
      fetchWorkspace();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={cancelEdit}>
          <Ionicons name="close" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le workspace</Text>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={saveWorkspace}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom du workspace *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Entrez le nom du workspace"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Entrez la description du workspace"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Statut</Text>
            <TouchableOpacity
              style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
              onPress={() => setIsActive(!isActive)}
            >
              <Ionicons 
                name={isActive ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={isActive ? "white" : Colors.light.text} 
              />
              <Text style={[styles.toggleButtonText, isActive && styles.toggleButtonTextActive]}>
                {isActive ? 'Actif' : 'Inactif'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workspace Info */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations système</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID du workspace:</Text>
            <Text style={styles.infoValue}>{workspace.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID utilisateur:</Text>
            <Text style={styles.infoValue}>{workspace.user_id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Créé le:</Text>
            <Text style={styles.infoValue}>
              {new Date(workspace.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Capteurs:</Text>
            <Text style={styles.infoValue}>{workspace.sensors.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.light.text,
    marginTop: 15,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  toggleButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 10,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 100,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
});
