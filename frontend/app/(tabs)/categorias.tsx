import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Modal, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const PRIMARY      = '#E91E8C';
const PRIMARY_DARK = '#C2185B';
const ACCENT       = '#FF80AB';
const BG           = '#FFF0F5';
const CARD_BG      = '#FFE4EF';

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  created_at: string;
  total_animes?: number;
}

export default function CategoriasScreen() {
  const { user } = useAuth();
  const router   = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre]         = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving]         = useState(false);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nombre, descripcion, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Get anime count for each category
      const withCount = await Promise.all(
        data.map(async (cat) => {
          const { count } = await supabase
            .from('categoria_animes')
            .select('id', { count: 'exact', head: true })
            .eq('categoria_id', cat.id);
          return { ...cat, total_animes: count ?? 0 };
        })
      );
      setCategorias(withCount);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(fetchCategorias);

  const handleCrear = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('categorias').insert({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      user_id: user!.id,
    });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setNombre('');
      setDescripcion('');
      setModalVisible(false);
      fetchCategorias();
    }
  };

  const handleEliminar = (id: string, nombre: string) => {
    Alert.alert(
      'Eliminar categoría',
      `¿Segura que quieres eliminar "${nombre}" y todos sus animes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            await supabase.from('categorias').delete().eq('id', id);
            fetchCategorias();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Categoria }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/categoria/${item.id}`)}>
      <View style={styles.cardTop}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Pressable onPress={() => handleEliminar(item.id, item.nombre)} hitSlop={10}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </Pressable>
      </View>
      {!!item.descripcion && <Text style={styles.cardDesc}>{item.descripcion}</Text>}
      <View style={styles.cardFooter}>
        <Text style={styles.cardCount}>🎌 {item.total_animes} anime{item.total_animes !== 1 ? 's' : ''}</Text>
        <Text style={styles.cardArrow}>Ver más →</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Nueva Categoría</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
      ) : categorias.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📂</Text>
          <Text style={styles.emptyText}>No tienes categorías aún</Text>
          <Text style={styles.emptyHint}>Crea tu primera categoría de anime 🌸</Text>
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal crear categoría */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>✨ Nueva Categoría</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mis favoritos, Por ver..."
              placeholderTextColor="#C48AA8"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Describe tu categoría..."
              placeholderTextColor="#C48AA8"
              multiline
              numberOfLines={3}
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => { setModalVisible(false); setNombre(''); setDescripcion(''); }}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleCrear} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>Crear</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, padding: 16 },
  addBtn: {
    backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginBottom: 16,
    elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35,
  },
  addBtnText:  { color: '#fff', fontWeight: '800', fontSize: 15 },
  list:        { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    borderLeftWidth: 5, borderLeftColor: PRIMARY,
    elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1,
  },
  cardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNombre: { fontSize: 17, fontWeight: '800', color: '#4A0030', flex: 1 },
  deleteBtn:  { fontSize: 18, paddingLeft: 8 },
  cardDesc:   { color: '#C48AA8', fontSize: 13, marginTop: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cardCount:  { fontSize: 12, color: PRIMARY_DARK, fontWeight: '600' },
  cardArrow:  { fontSize: 12, color: ACCENT, fontWeight: '700' },
  empty:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 56, marginBottom: 10 },
  emptyText:  { color: PRIMARY_DARK, fontSize: 17, fontWeight: '600', marginBottom: 10 },
  emptyHint:  { color: '#C48AA8', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalTitle:  { fontSize: 20, fontWeight: '800', color: PRIMARY_DARK, marginBottom: 16, textAlign: 'center' },
  label:       { color: PRIMARY_DARK, fontWeight: '700', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: CARD_BG, borderRadius: 12, padding: 13,
    fontSize: 14, color: '#4A0030', borderWidth: 1.5, borderColor: ACCENT,
  },
  inputMulti:  { height: 80, textAlignVertical: 'top' },
  modalBtns:   { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  cancelBtn: {
    flex: 1, marginRight: 6, borderWidth: 2, borderColor: ACCENT, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  cancelBtnText: { color: PRIMARY, fontWeight: '700' },
  saveBtn: {
    flex: 1, marginLeft: 6, backgroundColor: PRIMARY, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800' },
});
