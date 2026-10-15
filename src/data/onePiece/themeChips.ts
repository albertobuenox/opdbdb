/** Sugerencias temáticas asignables a proxies One Piece. */

export type OpThemeChipId =
  | "luffy"
  | "sanji"
  | "zoro"
  | "carpinteros"
  | "voluntad";

export interface OpThemeChipMeta {
  id: OpThemeChipId;
  label: string;
  /** Color principal del chip. */
  colorA: string;
  /** Segundo color (acento / franja). */
  colorB: string;
  hint: string;
}

export const OP_THEME_CHIPS: OpThemeChipMeta[] = [
  {
    id: "luffy",
    label: "Luffy",
    colorA: "#dc2626",
    colorB: "#2563eb",
    hint: "Rojo y azul",
  },
  {
    id: "sanji",
    label: "Sanji",
    colorA: "#171717",
    colorB: "#eab308",
    hint: "Negro y amarillo",
  },
  {
    id: "zoro",
    label: "Zoro",
    colorA: "#0d9488",
    colorB: "#14b8a6",
    hint: "Verde turquesa",
  },
  {
    id: "carpinteros",
    label: "Carpinteros / Revolución",
    colorA: "#9ca3af",
    colorB: "#ec4899",
    hint: "Gris y rosa",
  },
  {
    id: "voluntad",
    label: "Voluntad",
    colorA: "#7c3aed",
    colorB: "#a78bfa",
    hint: "Morado",
  },
];

export const OP_THEME_CHIP_MAP = Object.fromEntries(
  OP_THEME_CHIPS.map((c) => [c.id, c]),
) as Record<OpThemeChipId, OpThemeChipMeta>;

const VALID_IDS = new Set<string>(OP_THEME_CHIPS.map((c) => c.id));

export function normalizeThemeChips(
  chips: OpThemeChipId[] | undefined | null,
): OpThemeChipId[] {
  if (!Array.isArray(chips)) return [];
  return chips.filter((id): id is OpThemeChipId => VALID_IDS.has(id));
}

export function toggleThemeChip(
  chips: OpThemeChipId[],
  id: OpThemeChipId,
): OpThemeChipId[] {
  return chips.includes(id) ? chips.filter((c) => c !== id) : [...chips, id];
}
