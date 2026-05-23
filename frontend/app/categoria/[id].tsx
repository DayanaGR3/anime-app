import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Modal, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

const PRIMARY      = '#E91E8C';
const PRIMARY_DARK = '#C2185B';
const ACCENT       = '#FF80AB';
const BG           = '#FFF0F5';
const CARD_BG      = '#FFE4EF';

const ESTADOS = ['pendiente', 'viendo', 'completado'];
const ESTADO_COLOR: Record<string, string> = {
  pendiente:   '#FF80AB',
  viendo:      '#E91E8C',
  completado:  '#880E4F',
};
const ESTADO_EMOJI: Record<string, string> = {
  pendiente:   '⏳',
  viendo:      '▶️',
  completado:  '✅',
};

interface AnimeItem {
  id: string;
  titulo: string;
  genero: string;
  descripcion: string;
  estado: string;
  calificacion: number | null;
}

export default function CategoriaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [animes, setAnimes]         = useState<AnimeItem[]>([]);
  const [catNombre, setCatNombre]   = useState('');
  const [loading, setLoading]       = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem]     = useState<AnimeItem | null>(null);
  const [saving, setSaving]         = useState(false);

  // Form fields
  const [titulo, setTitulo]         = useState('');
  const [genero, setGenero]         = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado]         = useState('pendiente');
  const [calificacion, setCalificacion] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: cat } = await supabase.from('categorias').select('nombre').eq('id', id).single();
    if (cat) {
      setCatNombre(cat.nombre);
      navigation.setOptions({ headerTitle: `📂 ${cat.nombre}` });
    }

    const { data } = await supabase
      .from('categoria_animes')
      .select('*')
      .eq('categoria_id', id)
      .order('created_at', { ascending: false });

    setAnimes(data ?? []);
    setLoading(false);
  }, [id]);

  useFocusEffect(fetchData);

  const openCrear = () => {
    setEditItem(null);
    setTitulo(''); setGenero(''); setDescripcion(''); setEstado('pendiente'); setCalificacion('');
    setModalVisible(true);
  };

  const openEditar = (item: AnimeItem) => {
    setEditItem(item);
    setTitulo(item.titulo);
    setGenero(item.genero ?? '');
    setDescripcion(item.descripcion ?? '');
    setEstado(item.estado ?? 'pendiente');
    setCalificacion(item.calificacion?.toString() ?? '');
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!titulo.trim()) { Alert.alert('Error', 'El título es obligatorio'); return; }
    const cal = calificacion ? parseInt(calificacion) : null;
    if (cal !== null && (cal < 1 || cal > 10)) { Alert.alert('Error', 'Calificación entre 1 y 10'); return; }

    setSaving(true);
    if (editItem) {
      await supabase.from('categoria_animes').update({
        titulo: titulo.trim(), genero: genero.trim(),
        descripcion: descripcion.trim(), estado, calificacion: cal,
      }).eq('id', editItem.id);
    } else {
      await supabase.from('categoria_animes').insert({
        categoria_id: id, titulo: titulo.trim(), genero: genero.trim(),
        descripcion: descripcion.trim(), estado, calificacion: cal,
      });
    }
    setSaving(false);
    setModalVisible(false);
    fetchData();
  };

  const handleEliminar = (animeId: string, animeTitle: string) => {
    Alert.alert('Eliminar anime', `¿Eliminar "${animeTitle}" de la categoría?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          await supabase.from('categoria_animes').delete().eq('id', animeId);
          fetchData();
        },
      },
    ]);
  };

  const renderAnime = ({ item }: { item: AnimeItem }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: ESTADO_COLOR[item.estado] ?? PRIMARY }]}>
          <Text style={styles.estadoText}>{ESTADO_EMOJI[item.estado]} {item.estado}</Text>
        </View>
      </View>
      {!!item.genero      && <Text style={styles.cardGenero}>🎭 {item.genero}</Text>}
      {!!item.descripcion && <Text style={styles.cardDesc}>{item.descripcion}</Text>}
      {item.calificacion  && <Text style={styles.cardCal}>⭐ {item.calificacion}/10</Text>}
      <View style={styles.cardActions}>
        <Pressable style={styles.editBtn} onPress={() => openEditar(item)}>
          <Text style={styles.editBtnText}>✏️ Editar</Text>
        </Pressable>
        <Pressable style={styles.delBtn} onPress={() => handleEliminar(item.id, item.titulo)}>
          <Text style={styles.delBtnText}>🗑️ Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.addBtn} onPress={openCrear}>
        <Text style={styles.addBtnText}>+ Agregar Anime</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
      ) : animes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎌</Text>
          <Text style={styles.emptyText}>Sin animes en esta categoría</Text>
          <Text style={styles.emptyHint}>¡Agrega tu primer anime! 🌸</Text>
        </View>
      ) : (
        <FlatList
          data={animes}
          keyExtractor={(item) => item.id}
          renderItem={renderAnime}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal agregar/editar anime */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{editItem ? '✏️ Editar Anime' : '🎌 Nuevo Anime'}</Text>

              <Text style={styles.label}>Título *</Text>
              <TextInput style={styles.input} placeholder="Nombre del anime" placeholderTextColor="#C48AA8" value={titulo} onChangeText={setTitulo} />

              <Text style={styles.label}>Género</Text>
              <TextInput style={styles.input} placeholder="Shonen, Shojo, Isekai..." placeholderTextColor="#C48AA8" value={genero} onChangeText={setGenero} />

              <Text style={styles.label}>Descripción</Text>
              <TextInput style={[styles.input, styles.inputMulti]} placeholder="Breve descripción del anime..." placeholderTextColor="#C48AA8" multiline numberOfLines={3} value={descripcion} onChangeText={setDescripcion} />

              <Text style={styles.label}>Estado</Text>
              <View style={styles.estadoRow}>
                {ESTADOS.map((e) => (
                  <Pressable
                    key={e}
                    style={[styles.estadoOpt, estado === e && styles.estadoOptActive]}
                    onPress={() => setEstado(e)}
                  >
                    <Text style={[styles.estadoOptText, estado === e && styles.estadoOptTextActive]}>
                      {ESTADO_EMOJI[e]} {e}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Calificación (1-10)</Text>
              <TextInput
                style={styles.input} placeholder="Ej: 8" placeholderTextColor="#C48AA8"
                keyboardType="numeric" value={calificacion} onChangeText={setCalificacion}
              />

              <View style={styles.modalBtns}>
                <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </Pressable>
                <Pressable style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleGuardar} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Guardar</Text>}
                </Pressable>
              </View>
            </View>
          </ScrollView>
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
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    borderLeftWidth: 5, borderLeftColor: PRIMARY,
    elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1,
  },
  cardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle:  { fontSize: 16, fontWeight: '800', color: '#4A0030', flex: 1 },
  estadoBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  estadoText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  cardGenero: { color: PRIMARY_DARK, fontSize: 12, fontWeight: '600', marginTop: 6 },
  cardDesc:   { color: '#7A4060', fontSize: 13, marginTop: 4, lineHeight: 18 },
  cardCal:    { color: PRIMARY, fontWeight: '700', fontSize: 13, marginTop: 6 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  editBtn: {
    flex: 1, borderWidth: 1.5, borderColor: ACCENT, borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
  },
  editBtnText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },
  delBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#FF6B6B', borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
  },
  delBtnText: { color: '#FF6B6B', fontWeight: '700', fontSize: 12 },
  empty:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 56 },
  emptyText:  { color: PRIMARY_DARK, fontSize: 17, fontWeight: '600' },
  emptyHint:  { color: '#C48AA8', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalTitle:  { fontSize: 20, fontWeight: '800', color: PRIMARY_DARK, marginBottom: 8, textAlign: 'center' },
  label:       { color: PRIMARY_DARK, fontWeight: '700', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: CARD_BG, borderRadius: 12, padding: 13,
    fontSize: 14, color: '#4A0030', borderWidth: 1.5, borderColor: ACCENT,
  },
  inputMulti:    { height: 75, textAlignVertical: 'top' },
  estadoRow:     { flexDirection: 'row', gap: 8, marginTop: 2 },
  estadoOpt:     { flex: 1, borderWidth: 1.5, borderColor: ACCENT, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  estadoOptActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  estadoOptText: { color: PRIMARY, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  estadoOptTextActive: { color: '#fff' },
  modalBtns:     { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1, borderWidth: 2, borderColor: ACCENT, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  cancelBtnText: { color: PRIMARY, fontWeight: '700' },
  saveBtn: { flex: 1, backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800' },
});
