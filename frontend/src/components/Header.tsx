import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = false }: HeaderProps) {
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.replace('/sign-in');
  };

  return (
    <View
      style={{ paddingTop: Platform.OS === 'ios' ? top : top + 8 }}
      className="bg-white border-b border-gray-200"
    >
      <View className="h-14 flex-row items-center px-4">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-secondary-200 px-3 py-1.5 rounded-full ml-auto"
        >
          <Text className="text-secondary-800 font-medium text-sm">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
