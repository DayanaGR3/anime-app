-- ══════════════════════════════════════════════════════════
-- ANIME APP - Tablas para categorías personalizadas
-- Ejecutar en: Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════

-- Tabla de categorías del usuario
CREATE TABLE IF NOT EXISTS categorias (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de animes dentro de cada categoría
CREATE TABLE IF NOT EXISTS categoria_animes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE NOT NULL,
  titulo       TEXT NOT NULL,
  genero       TEXT DEFAULT '',
  descripcion  TEXT DEFAULT '',
  estado       TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'viendo', 'completado')),
  calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 10),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security (cada usuario solo ve sus datos) ──────────────────────

ALTER TABLE categorias       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria_animes ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias
CREATE POLICY "Usuarios gestionan sus categorias"
  ON categorias FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para animes de categorias
CREATE POLICY "Usuarios gestionan animes de sus categorias"
  ON categoria_animes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM categorias
      WHERE id = categoria_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM categorias
      WHERE id = categoria_id AND user_id = auth.uid()
    )
  );

-- ── Índices para mejorar rendimiento ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_categorias_user_id        ON categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_cat_animes_categoria_id   ON categoria_animes(categoria_id);
