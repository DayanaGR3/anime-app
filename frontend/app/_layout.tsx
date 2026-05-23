import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AnimeProvider } from '../context/AnimeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/saint-seiya');
    }
  }, [session, loading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AnimeProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="categoria/[id]"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#E91E8C' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTitle: '📂 Mi Categoría',
              }}
            />
          </Stack>
        </AuthGuard>
      </AnimeProvider>
    </AuthProvider>
  );
}
