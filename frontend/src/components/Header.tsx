import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.replace('/sign-in');
  };

  return (
    <View style={{ paddingTop: top }} className="bg-white">
      <View className="h-16 flex-row items-center justify-between px-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-secondary-200 px-3 py-1.5 rounded-full"
        >
          <Text className="text-secondary-800 font-medium text-sm">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
