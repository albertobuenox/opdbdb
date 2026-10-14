# One Piece Deck Building

Herramienta local (Vite + React) para crear **proxies temáticos One Piece** de las cartas de **Astro Knights**, con dos bases enlazables:

1. **Base Astro Knights** — planetas natales y cartas (combustible / arma) sembradas desde las fotos de `Astro-Knights-References/`.
2. **Cartas One Piece** — las que irás creando; cada una podrá referenciar el `id` de su equivalente Astro Knights (`astroKnightsCardId`).

Los datos viven en el navegador (**IndexedDB**). No hay servidor.

## Arranque

```bash
npm install
npm run dev
```

## Base Astro Knights (seed)

Al abrir la app se cargan las tablas `akCities` y `akCards` desde:

- `src/data/astroKnights/cities.seed.ts`
- `src/data/astroKnights/cards.seed.ts`

Las cartas con texto dudoso (foto borrosa / watermark) llevan `needsReview: true` y se muestran con **⚠**. Puedes marcar/desmarcar revisión en la UI, o pulsar **Re-seed desde fotos** para volver al seed.

### Ciudades (`akCities`)

| Campo | Descripción |
|-------|-------------|
| `id` | ID impreso (186–189) |
| `name` | Nombre |
| `description` | Habilidad de activar |
| `life` | Vida |
| `initialCharge` | Carga inicial |
| `chargeLevels` | Track de carga |
| `needsReview` | Revisar a mano |

### Cartas (`akCards`)

| Campo | Descripción |
|-------|-------------|
| `id` | ID principal (menor printId del diseño) |
| `name`, `type`, `description` | Combustible / Arma / Tecnología |
| `cost` | `null` en básicas; número en mercado |
| `deck` | `basico_heroe` \| `mercado` |
| `category` | `energia` \| `tecnicas` |
| `level` | `null` o 1–3 |
| `quantity` / `printIds` | Copias físicas |
| `onePieceCardId` | FK futura al proxy OP |
| `needsReview` | Revisar a mano |

**Pendiente de fotos / revisión:** cartas de **Tecnología** y **únicas de héroe** sembradas desde `public/references/` con `needsReview: true` (algunos IDs provisionales).

## Export Card Engine

Misma lógica que antes: plantillas por tipo, tags CSV (`Titulo`, `Tipo`, `Descripcion`, `Coste`, `Codigo`, `Icono`, `Arte`), export CSV + ZIP de imágenes.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar el build |
