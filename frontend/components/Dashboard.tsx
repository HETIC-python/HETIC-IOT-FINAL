import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-neutral-900" edges={['bottom']}>
      <ScrollView
        className="px-4 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text className="text-black text-[22px] font-semibold mb-2">Dashboard</Text>

        {/* Grille responsive sans basis% */}
        <View className="w-full flex-row flex-wrap -mx-1 mb-4">
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-4 mb-2">
            <Text className="text-black font-semibold mb-1">Chambre</Text>
            <Text className="text-black">20.5 °C</Text>
          </View>
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-4 mb-2">
            <Text className="text-black font-semibold mb-1">Bureau</Text>
            <Text className="text-black">—</Text>
          </View>
        </View>

        {/* Pleine largeur */}
        <View className="bg-black rounded-2xl w-full p-4 mb-4">
          <Text className="text-black font-semibold mb-1">Résumé IA de la journée</Text>
          <Text className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta in architecto voluptate
            fugiat fugit. Provident autem suscipit esse itaque.
          </Text>
        </View>

        {/* Alertes en grille */}
        <View className="w-full flex-row flex-wrap -mx-1 mb-4">
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-3 mb-2">
            <Text className="text-black text-center">Température élevée dans la chambre</Text>
          </View>
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-3 mb-2">
            <Text className="text-black text-center">Température élevée au bureau</Text>
          </View>
        </View>

        {/* Sections pleine largeur */}
        <View className="bg-black rounded-2xl w-full p-4 mb-4">
          <Text className="text-black font-semibold mb-1">Mouvements</Text>
          <Text className="text-gray-400">7 détections aujourd'hui</Text>
        </View>

        <View className="bg-black rounded-2xl w-full p-4 mb-4">
          <Text className="text-black font-semibold mb-1">Horaires</Text>
          <Text className="text-gray-400">8:16 PM</Text>
        </View>

        <View className="bg-black rounded-2xl w-full p-4 mb-2">
          <Text className="text-black font-semibold">Activité stat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
