import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAnime } from "@/context/AnimeContext";
import ModalImagenes from "@/components/ModalImagenes";

const PRIMARY      = "#E91E8C";
const PRIMARY_DARK = "#C2185B";
const ACCENT       = "#FF80AB";
const BG           = "#FFF0F5";
const CARD_BG      = "#FFE4EF";

export default function ResumenScreen() {
  const { personajes } = useAnime();
  const [mostrarModal, setMostrarModal] = useState(false);

  const saints  = personajes["saint-seiya"];
  const hunters = personajes["hunter-x-hunter"];
  const pirates = personajes["one-piece"];

  const todosPersonajes = [saints, hunters, pirates].filter(Boolean);
  const todasImagenes   = todosPersonajes.flatMap((p) => (p ? p.imagenes : []));

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 RESUMEN</Text>
        <Text style={styles.headerSubtitle}>Personajes consultados</Text>
      </View>

      <View style={styles.container}>
        {todosPersonajes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyText}>No se han consultado personajes aún</Text>
            <Text style={styles.emptyHint}>Usa las pestañas para buscar personajes</Text>
          </View>
        ) : (
          <>
            {saints && (
              <View style={[styles.card, { borderLeftColor: "#E91E8C" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: PRIMARY }]}>⚔️ Saint Seiya</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{saints.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{saints.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{saints.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{saints.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {hunters && (
              <View style={[styles.card, { borderLeftColor: "#AD1457" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: "#AD1457" }]}>🎯 Hunter x Hunter</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{hunters.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{hunters.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{hunters.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{hunters.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {pirates && (
              <View style={[styles.card, { borderLeftColor: "#880E4F" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: "#880E4F" }]}>🏴‍☠️ One Piece</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{pirates.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{pirates.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{pirates.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{pirates.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {todasImagenes.length > 0 && (
              <Pressable style={styles.imagesButton} onPress={() => setMostrarModal(true)}>
                <Text style={styles.imagesButtonText}>🌸 Ver todas las imágenes ({todasImagenes.length})</Text>
              </Pressable>
            )}
          </>
        )}

        <ModalImagenes
          visible={mostrarModal}
          imagenes={todasImagenes}
          onClose={() => setMostrarModal(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingTop: 30, paddingBottom: 24, paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 2 },
  headerSubtitle: { color: ACCENT, fontSize: 14, marginTop: 4, fontStyle: "italic" },
  container: {
    flex: 1, backgroundColor: BG,
    alignItems: "center", paddingHorizontal: 20, paddingTop: 30, paddingBottom: 40,
  },
  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 20, gap: 10 },
  emptyEmoji: { fontSize: 56 },
  emptyText: { color: PRIMARY_DARK, fontSize: 17, fontWeight: "600", textAlign: "center" },
  emptyHint: { color: "#C48AA8", fontSize: 14, textAlign: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 18, width: "100%",
    marginBottom: 16, overflow: "hidden", borderLeftWidth: 5,
    elevation: 5, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12,
  },
  cardHeader: { padding: 12, paddingBottom: 8, backgroundColor: CARD_BG },
  animeTitle: { fontSize: 14, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  cardBody: { padding: 16, paddingTop: 10 },
  cardName: { fontSize: 20, fontWeight: "800", marginBottom: 12, textTransform: "uppercase", color: "#4A0030" },
  infoRow: { marginBottom: 10 },
  infoLabel: { color: PRIMARY_DARK, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  infoValue: { color: "#4A0030", fontSize: 14, lineHeight: 20 },
  imagesButton: {
    backgroundColor: PRIMARY, borderRadius: 14,
    paddingHorizontal: 40, paddingVertical: 14,
    marginTop: 8, marginBottom: 16, width: "100%", alignItems: "center",
    elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35,
  },
  imagesButtonText: { color: "#fff", fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
});
