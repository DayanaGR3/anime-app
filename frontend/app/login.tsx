import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const PRIMARY      = '#E91E8C';
const PRIMARY_DARK = '#C2185B';
const ACCENT       = '#FF80AB';
const BG           = '#FFF0F5';
const CARD_BG      = '#FFE4EF';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error al iniciar sesión', error.message);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.emoji}>🌸</Text>
          <Text style={styles.title}>Anime App</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tucorreo@email.com"
            placeholderTextColor="#C48AA8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#C48AA8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Iniciar Sesión</Text>
            }
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>¿No tienes cuenta?</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.btnOutline} onPress={() => router.push('/register')}>
            <Text style={styles.btnOutlineText}>Crear cuenta nueva</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:     { flex: 1, backgroundColor: BG },
  scroll:   { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header:   { alignItems: 'center', marginBottom: 32 },
  emoji:    { fontSize: 64, marginBottom: 8 },
  title:    { fontSize: 32, fontWeight: '900', color: PRIMARY_DARK, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#C48AA8', marginTop: 4 },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    elevation: 6, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15,
  },
  label:  { color: PRIMARY_DARK, fontWeight: '700', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: CARD_BG, borderRadius: 12, padding: 14,
    fontSize: 15, color: '#4A0030', borderWidth: 1.5, borderColor: ACCENT,
  },
  btn: {
    backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', marginTop: 24,
    elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4,
  },
  btnDisabled: { opacity: 0.7 },
  btnText:     { color: '#fff', fontWeight: '800', fontSize: 16 },
  divider:     { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 8 },
  line:        { flex: 1, height: 1, backgroundColor: ACCENT },
  dividerText: { color: '#C48AA8', fontSize: 12, fontWeight: '600' },
  btnOutline: {
    borderWidth: 2, borderColor: PRIMARY, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center',
  },
  btnOutlineText: { color: PRIMARY, fontWeight: '800', fontSize: 15 },
});
