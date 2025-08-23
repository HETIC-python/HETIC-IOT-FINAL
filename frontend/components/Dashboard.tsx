import { Ionicons } from '@expo/vector-icons';
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
        {/* Header */}
        <Text className="text-black text-[22px] font-semibold mb-3">Accueil</Text>

        {/* Cartes Capteurs : Chambre / Bureau */}
        <View className="w-full flex-row flex-wrap -mx-1 mb-4">
          {/* Chambre */}
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-4 mb-2">
            <View className="flex-row items-center mb-2">
              <Ionicons name="home" size={30} color="black" />
              <Text className="text-black font-semibold ml-2">Chambre</Text>
            </View>
            <Text className="text-black text-3xl font-semibold">21,5°C</Text>

            <View className="flex-row mt-2">
              <View className="bg-black/10 rounded-full px-2 py-1 mr-2">
                <Text className="text-black text-xs">52%</Text>
              </View>
              <View className="bg-green-600/25 rounded-full px-2 py-1">
                <Text className="text-green-400 text-xs">Actif</Text>
              </View>
            </View>
          </View>

          {/* Bureau */}
          <View className="bg-black rounded-2xl flex-1 min-w-[160] mx-1 p-4 mb-2">
            <View className="flex-row items-center mb-2">
              <Ionicons name="briefcase" size={30} color="black" />
              <Text className="text-black font-semibold ml-2">Bureau</Text>
            </View>
            <Text className="text-black text-3xl font-semibold">22,5°C</Text>

            <View className="flex-row mt-2">
              <View className="bg-black/10 rounded-full px-2 py-1 mr-2">
                <Text className="text-black text-xs">52%</Text>
              </View>
              <View className="bg-black/10 rounded-full px-2 py-1">
                <Text className="text-gray-300 text-xs">Calme</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Résumé IA de la journée */}
        <View className="bg-black rounded-2xl w-full p-4 mb-4">
          <View className="flex-row items-center mb-1">
            <Ionicons name="chatbox-outline" size={30} color="black" />
            <Text className="text-black font-semibold ml-2">Résumé IA de la journée</Text>
          </View>
          <Text className="text-gray-400">
            La température dans la chambre est restée stable aujourd’hui.
          </Text>
        </View>

        {/* Alertes (2 tuiles colorées) */}
        <View className="w-full flex-row flex-wrap -mx-1 mb-4">
          <View className="rounded-2xl flex-1 min-w-[160] mx-1 p-3 mb-2 bg-orange-600/20">
            <View className="flex-row items-center mb-1">
              <View className="bg-orange-500/30 rounded-full p-1 mr-2">
                <Ionicons name="thermometer" size={14} color="#fb923c" />
              </View>
              <Text className="text-orange-300 font-semibold">Température élevée</Text>
            </View>
            <Text className="text-orange-200">dans la chambre</Text>
          </View>

          <View className="rounded-2xl flex-1 min-w-[160] mx-1 p-3 mb-2 bg-rose-600/20">
            <View className="flex-row items-center mb-1">
              <View className="bg-rose-500/30 rounded-full p-1 mr-2">
                <Ionicons name="thermometer" size={14} color="#f43f5e" />
              </View>
              <Text className="text-rose-300 font-semibold">Température moins élevée</Text>
            </View>
            <Text className="text-rose-200">au bureau</Text>
          </View>
        </View>

        {/* Dernier mouvement détecté */}
        <View className="bg-black rounded-2xl w-full p-4 mb-4">
          <View className="flex-row items-center mb-1">
            <Ionicons name="man-outline" size={30} color="black" />
            <Text className="text-black font-semibold ml-2">Dernier mouvement détecté</Text>
          </View>
          <Text className="text-gray-400">Calme depuis 3h</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
