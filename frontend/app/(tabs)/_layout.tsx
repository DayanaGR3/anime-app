import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E91E8C',
        tabBarInactiveTintColor: '#C48AA8',
        tabBarStyle: {
          backgroundColor: '#FFF0F5',
          borderTopColor: '#F48FB1',
          borderTopWidth: 2,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        headerStyle: { backgroundColor: '#E91E8C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 17 },
        headerRight: () => (
          <Pressable onPress={signOut} style={{ marginRight: 14 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Salir 🚪</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="saint-seiya"     options={{ title: '⚔️ Saint Seiya',  headerTitle: '⚔️ Saint Seiya' }} />
      <Tabs.Screen name="hunter-x-hunter" options={{ title: '🎯 Hunter',        headerTitle: '🎯 Hunter x Hunter' }} />
      <Tabs.Screen name="one-piece"       options={{ title: '🏴‍☠️ One Piece', headerTitle: '🏴‍☠️ One Piece' }} />
      <Tabs.Screen name="categorias"      options={{ title: '📂 Categorías',    headerTitle: '📂 Mis Categorías' }} />
      <Tabs.Screen name="index"           options={{ title: '📋 Resumen',       headerTitle: '📋 Resumen' }} />
    </Tabs>
  );
}
