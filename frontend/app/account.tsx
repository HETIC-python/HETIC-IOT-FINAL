import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function AccountScreen() {
  const { user, token, isSignedIn, signOut, loadUserInfo } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'You have been signed out');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleRefreshUserInfo = async () => {
    try {
      await loadUserInfo();
      Alert.alert('Success', 'User information refreshed');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh user information');
    }
  };

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.message}>Please sign in to view your account information</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{user.id}</Text>
          
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
          
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
          
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role}</Text>
          
          <Text style={styles.label}>Account Validated:</Text>
          <Text style={styles.value}>{user.is_validated ? 'Yes' : 'No'}</Text>
          
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </Text>
          
          {user.address_line && (
            <>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{user.address_line}</Text>
            </>
          )}
          
          {user.city && (
            <>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.value}>{user.city}</Text>
            </>
          )}
          
          {user.postal_code && (
            <>
              <Text style={styles.label}>Postal Code:</Text>
              <Text style={styles.value}>{user.postal_code}</Text>
            </>
          )}
          
          {user.country && (
            <>
              <Text style={styles.label}>Country:</Text>
              <Text style={styles.value}>{user.country}</Text>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.message}>Loading user information...</Text>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRefreshUserInfo}>
          <Text style={styles.buttonText}>Refresh User Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tokenInfo}>
        <Text style={styles.label}>Token Status:</Text>
        <Text style={styles.value}>{token ? 'Valid' : 'Invalid'}</Text>
        <Text style={styles.tokenPreview}>
          {token ? `${token.substring(0, 20)}...` : 'No token'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  tokenPreview: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 5,
  },
});
