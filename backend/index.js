require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const ws      = require('ws');
const { createClient } = require('@supabase/supabase-js');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { realtime: { transport: ws } }
);

// ── Swagger ───────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Anime App API', version: '2.0.0', description: 'API REST para personajes de anime y categorias personalizadas.' },
    servers: [{ url: process.env.SERVER_URL || 'http://localhost:3000' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Personaje: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, descripcion: { type: 'string' }, poder_tecnica: { type: 'string' }, anime: { type: 'string' }, imagenes: { type: 'array', items: { type: 'string' } } } },
        Categoria: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, descripcion: { type: 'string' }, created_at: { type: 'string' } } },
        AnimeCategoria: { type: 'object', properties: { id: { type: 'string' }, titulo: { type: 'string' }, genero: { type: 'string' }, descripcion: { type: 'string' }, estado: { type: 'string', enum: ['pendiente','viendo','completado'] }, calificacion: { type: 'integer', minimum: 1, maximum: 10 } } },
        Error: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  },
  apis: [__filename],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const fs = require('fs'); const path = require('path');
fs.writeFileSync(path.join(__dirname, 'openapi.json'), JSON.stringify(swaggerSpec, null, 2));

// ── Auth middleware ───────────────────────────────────────────────────────────
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Token invalido o expirado' });
  req.user = user;
  next();
}

// ── Helpers personajes ────────────────────────────────────────────────────────
const ANIMES = ['saint-seiya', 'hunter-x-hunter', 'one-piece'];

async function getPersonajeByNombre(nombre, animeSlug) {
  const { data: anime, error: animeError } = await supabase.from('animes').select('id').eq('slug', animeSlug).single();
  if (animeError || !anime) return null;

  const { data: personajes, error: personajeError } = await supabase
    .from('personajes')
    .select('id, nombre, descripcion, poder_tecnica, anime_id')
    .eq('anime_id', anime.id)
    .ilike('nombre', `%${nombre}%`)
    .limit(1);
  if (personajeError || !personajes || personajes.length === 0) return null;

  const personaje = personajes[0];
  const { data: imagenes } = await supabase
    .from('imagenes')
    .select('url')
    .eq('personaje_id', personaje.id)
    .order('id');

  return {
    id: personaje.id,
    nombre: personaje.nombre,
    descripcion: personaje.descripcion,
    habilidades: personaje.poder_tecnica,
    anime: animeSlug,
    imagenes: imagenes ? imagenes.map(img => img.url) : [],
  };
}

// ═══════════════════════════════════════════════════
// RUTAS PERSONAJES
// ═══════════════════════════════════════════════════

/**
 * @openapi
 * /api/{anime}/{nombre}:
 *   get:
 *     summary: Buscar personaje por nombre
 *     tags: [Personajes]
 *     parameters:
 *       - { name: anime, in: path, required: true, schema: { type: string, enum: [saint-seiya, hunter-x-hunter, one-piece] } }
 *       - { name: nombre, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Personaje encontrado }
 *       404: { description: No encontrado }
 */
app.get('/api/:anime/:nombre', async (req, res) => {
  const { anime, nombre } = req.params;
  if (!ANIMES.includes(anime)) return res.status(400).json({ error: 'Anime no valido' });
  const personaje = await getPersonajeByNombre(nombre, anime);
  if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
  res.json(personaje);
});

/**
 * @openapi
 * /api/{anime}:
 *   get:
 *     summary: Todos los personajes de un anime
 *     tags: [Personajes]
 *     parameters:
 *       - { name: anime, in: path, required: true, schema: { type: string, enum: [saint-seiya, hunter-x-hunter, one-piece] } }
 *     responses:
 *       200: { description: Lista de personajes }
 */
app.get('/api/:anime', async (req, res) => {
  const { anime } = req.params;
  if (!ANIMES.includes(anime)) return res.status(400).json({ error: 'Anime no valido' });

  const { data: animeData, error: animeError } = await supabase.from('animes').select('id').eq('slug', anime).single();
  if (animeError || !animeData) return res.status(404).json({ error: 'Anime no encontrado' });

  const { data: personajes, error } = await supabase
    .from('personajes')
    .select('id, nombre, descripcion, poder_tecnica')
    .eq('anime_id', animeData.id)
    .order('id');
  if (error) return res.status(500).json({ error: error.message });

  const result = [];
  for (const p of personajes) {
    const { data: imagenes } = await supabase
      .from('imagenes')
      .select('url')
      .eq('personaje_id', p.id)
      .order('id');
    result.push({
      ...p,
      habilidades: p.poder_tecnica,
      anime,
      imagenes: imagenes ? imagenes.map(img => img.url) : [],
    });
  }
  res.json(result);
});

// ═══════════════════════════════════════════════════
// RUTAS CATEGORIAS (protegidas)
// ═══════════════════════════════════════════════════

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     summary: Listar mis categorias
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de categorias }
 *       401: { description: No autorizado }
 */
app.get('/api/categorias', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('categorias').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @openapi
 * /api/categorias:
 *   post:
 *     summary: Crear nueva categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string }
 *     responses:
 *       201: { description: Categoria creada }
 */
app.post('/api/categorias', requireAuth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const { data, error } = await supabase.from('categorias').insert({ nombre: nombre.trim(), descripcion: descripcion?.trim() ?? '', user_id: req.user.id }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Categoria actualizada }
 */
app.put('/api/categorias/:id', requireAuth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  const { data, error } = await supabase.from('categorias').update({ nombre, descripcion }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Categoria no encontrada' });
  res.json(data);
});

/**
 * @openapi
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       204: { description: Eliminada }
 */
app.delete('/api/categorias/:id', requireAuth, async (req, res) => {
  await supabase.from('categorias').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  res.status(204).send();
});

/**
 * @openapi
 * /api/categorias/{id}/animes:
 *   get:
 *     summary: Listar animes de una categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Lista de animes }
 */
app.get('/api/categorias/:id/animes', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('categoria_animes').select('*').eq('categoria_id', req.params.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @openapi
 * /api/categorias/{id}/animes:
 *   post:
 *     summary: Agregar anime a una categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AnimeCategoria' }
 *     responses:
 *       201: { description: Anime agregado }
 */
app.post('/api/categorias/:id/animes', requireAuth, async (req, res) => {
  const { titulo, genero, descripcion, estado, calificacion } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'El titulo es obligatorio' });
  const { data, error } = await supabase.from('categoria_animes').insert({
    categoria_id: req.params.id,
    titulo: titulo.trim(),
    genero: genero?.trim() ?? '',
    descripcion: descripcion?.trim() ?? '',
    estado: estado ?? 'pendiente',
    calificacion: calificacion ? parseInt(calificacion) : null,
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @openapi
 * /api/categorias/{id}/animes/{animeId}:
 *   put:
 *     summary: Actualizar anime de una categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *       - { name: animeId, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Anime actualizado }
 */
app.put('/api/categorias/:id/animes/:animeId', requireAuth, async (req, res) => {
  const { titulo, genero, descripcion, estado, calificacion } = req.body;
  const { data, error } = await supabase.from('categoria_animes')
    .update({ titulo, genero, descripcion, estado, calificacion: calificacion ? parseInt(calificacion) : null })
    .eq('id', req.params.animeId)
    .eq('categoria_id', req.params.id)
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @openapi
 * /api/categorias/{id}/animes/{animeId}:
 *   delete:
 *     summary: Eliminar anime de una categoria
 *     tags: [Categorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *       - { name: animeId, in: path, required: true, schema: { type: string } }
 *     responses:
 *       204: { description: Eliminado }
 */
app.delete('/api/categorias/:id/animes/:animeId', requireAuth, async (req, res) => {
  await supabase.from('categoria_animes').delete()
    .eq('id', req.params.animeId)
    .eq('categoria_id', req.params.id);
  res.status(204).send();
});

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentacion en http://localhost:${PORT}/api/docs`);
});