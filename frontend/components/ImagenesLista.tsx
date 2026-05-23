import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH - 80;

interface ImagenesListaProps {
  imagenes: string[];
}

function ImagenItem({ url, index }: { url: string; index: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.imageContainer}>
      <Text style={styles.imageLabel}>Imagen {index + 1}</Text>
      <View style={styles.imageWrapper}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E91E8C" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>❌</Text>
            <Text style={styles.errorText}>No se pudo cargar</Text>
          </View>
        ) : (
          <Image
            source={{ uri: url }}
            style={[styles.image, loading && styles.imageHidden]}
            resizeMode="contain"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }}
          />
        )}
      </View>
    </View>
  );
}

export default function ImagenesLista({ imagenes }: ImagenesListaProps) {
  if (imagenes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌸 Imágenes ({imagenes.length})</Text>
      </View>
      <View style={styles.imagesList}>
        {imagenes.map((url, i) => (
          <ImagenItem key={i} url={url} index={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#F48FB1",
  },
  header: {
    backgroundColor: "#E91E8C",
    padding: 14,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagesList: {
    padding: 16,
    backgroundColor: "#FFE4EF",
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  imageLabel: {
    color: "#C2185B",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: 220,
    backgroundColor: "#FFF0F5",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#F48FB1",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#E91E8C",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorText: {
    color: "#C2185B",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
    width: IMAGE_WIDTH - 4,
    height: 216,
  },
  imageHidden: {
    opacity: 0,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFE4EF",
    borderRadius: 14,
    marginTop: 16,
  },
  emptyText: {
    color: "#C48AA8",
    fontSize: 16,
    fontWeight: "bold",
  },
});
