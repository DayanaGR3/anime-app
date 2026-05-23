import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface ModalImagenesProps {
  visible: boolean;
  imagenes: string[];
  onClose: () => void;
}

export default function ModalImagenes({ visible, imagenes, onClose }: ModalImagenesProps) {
  const total = imagenes.length;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>

          <View style={styles.header}>
            <Text style={styles.title}>🌸 Imágenes ({total})</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {total === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {imagenes.map((url, i) => (
                  <View key={i} style={styles.imageSlot}>
                    <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
                    <Text style={styles.imageLabel}>Imagen {i + 1}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(233,30,140,0.25)",
    justifyContent: "center", alignItems: "center", padding: 20,
  },
  modalContainer: {
    width: "100%", maxWidth: 500, maxHeight: "85%",
    backgroundColor: "#fff", borderRadius: 24, overflow: "hidden",
    borderWidth: 2, borderColor: "#F48FB1",
    elevation: 12, shadowColor: "#E91E8C", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, backgroundColor: "#E91E8C",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
  },
  closeButtonText: { color: "#E91E8C", fontSize: 16, fontWeight: "bold" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  emptyContainer: { alignItems: "center", justifyContent: "center", padding: 40 },
  emptyText: { color: "#C48AA8", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  imageSlot: {
    width: "48%", alignItems: "center",
    backgroundColor: "#FFF0F5", borderRadius: 14,
    padding: 10, borderWidth: 1.5, borderColor: "#F48FB1",
    marginBottom: 14,
  },
  image: { width: "100%", height: 150, borderRadius: 10, backgroundColor: "#FFE4EF" },
  imageLabel: { color: "#C2185B", fontSize: 12, marginTop: 8, fontWeight: "600", textAlign: "center" },
});
