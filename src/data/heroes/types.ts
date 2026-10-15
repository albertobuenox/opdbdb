/** Carta de héroe: tablero con vida, ultimate, técnicas, equipo y habilidades. */

export type HeroTraitId =
  | "haki"
  | "usuario"
  | "capitan"
  | "poderoso"
  | "libertador"
  | "superviviente";

export type HakiKind = "armadura" | "observacion" | "rey";

/** Dónde es más fuerte el héroe respecto a la casilla umbral. */
export type LifeThresholdBias = "above" | "below" | "exact";

export interface HeroLoadoutItem {
  id: string;
  name: string;
  description: string;
}

export interface HeroCard {
  id: string;
  name: string;
  /** Casillas de vida, de 1 a lifeMax. Lo normal es 10. */
  lifeMax: number;
  /** Casilla que marca el umbral (entre 1 y lifeMax). */
  lifeThreshold: number;
  lifeThresholdBias: LifeThresholdBias;
  /** Qué gana en su zona fuerte. */
  lifeThresholdText: string;
  /** Casillas de ultimate, de 0 a ultimateMax. Lo normal es 4. Se activa en la máxima. */
  ultimateMax: number;
  ultimateName: string;
  ultimateDescription: string;
  /** Slots de técnicas. Lo normal es 4. */
  techniqueSlots: number;
  equipment: HeroLoadoutItem[];
  abilities: HeroLoadoutItem[];
  traits: HeroTraitId[];
  /** Subtipos de Haki. Solo si el rasgo Haki está activo. */
  haki: HakiKind[];
  weaknesses: string[];
}

export interface HeroTraitMeta {
  id: HeroTraitId;
  label: string;
  hint: string;
}

export const HERO_TRAITS: HeroTraitMeta[] = [
  { id: "haki", label: "Haki", hint: "De armadura, de observación o del rey" },
  { id: "usuario", label: "Usuario", hint: "Usuario de akuma no mi" },
  { id: "capitan", label: "Capitán", hint: "Capitán de una tripulación" },
  { id: "poderoso", label: "Poderoso", hint: "Poder por encima de lo habitual" },
  { id: "libertador", label: "Libertador", hint: "Libera o arrastra a otros" },
  { id: "superviviente", label: "Superviviente", hint: "Sigue en pie cuando otros caen" },
];

export const HAKI_KINDS: { id: HakiKind; label: string }[] = [
  { id: "armadura", label: "De armadura" },
  { id: "observacion", label: "De observación" },
  { id: "rey", label: "Del rey" },
];

export const THRESHOLD_BIASES: {
  id: LifeThresholdBias;
  label: string;
  hint: string;
}[] = [
  {
    id: "above",
    label: "Por encima",
    hint: "Más fuerte cuando la vida está por encima del umbral",
  },
  {
    id: "below",
    label: "Por debajo",
    hint: "Más fuerte cuando la vida está por debajo del umbral",
  },
  {
    id: "exact",
    label: "En la casilla",
    hint: "Más fuerte justo en la casilla del umbral",
  },
];

export const HERO_LIMITS = {
  lifeMax: 20,
  ultimateMax: 8,
  techniqueSlots: 8,
} as const;

const TRAIT_IDS = new Set(HERO_TRAITS.map((trait) => trait.id));
const HAKI_IDS = new Set(HAKI_KINDS.map((kind) => kind.id));
const BIAS_IDS = new Set(THRESHOLD_BIASES.map((bias) => bias.id));

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function blankHero(): HeroCard {
  return {
    id: "",
    name: "",
    lifeMax: 10,
    lifeThreshold: 5,
    lifeThresholdBias: "above",
    lifeThresholdText: "",
    ultimateMax: 4,
    ultimateName: "",
    ultimateDescription: "",
    techniqueSlots: 4,
    equipment: [],
    abilities: [],
    traits: [],
    haki: [],
    weaknesses: [],
  };
}

export function newLoadoutItem(): HeroLoadoutItem {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, name: "", description: "" };
}

export function slugHeroId(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug ? `heroe-${slug}` : "";
}

function normalizeItems(items: HeroLoadoutItem[] | undefined): HeroLoadoutItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => ({
    id: item?.id || `item-${index + 1}`,
    name: item?.name ?? "",
    description: item?.description ?? "",
  }));
}

export function normalizeHero(hero: HeroCard): HeroCard {
  const base = blankHero();
  const lifeMax = clampInt(hero?.lifeMax ?? base.lifeMax, 1, HERO_LIMITS.lifeMax);
  const ultimateMax = clampInt(
    hero?.ultimateMax ?? base.ultimateMax,
    0,
    HERO_LIMITS.ultimateMax,
  );
  const traits = (hero?.traits ?? []).filter((trait): trait is HeroTraitId =>
    TRAIT_IDS.has(trait),
  );
  const rawBias = hero?.lifeThresholdBias;
  const bias =
    rawBias !== undefined && BIAS_IDS.has(rawBias) ? rawBias : base.lifeThresholdBias;
  return {
    id: hero?.id ?? "",
    name: hero?.name ?? "",
    lifeMax,
    lifeThreshold: clampInt(hero?.lifeThreshold ?? base.lifeThreshold, 1, lifeMax),
    lifeThresholdBias: bias,
    lifeThresholdText: hero?.lifeThresholdText ?? "",
    ultimateMax,
    ultimateName: hero?.ultimateName ?? "",
    ultimateDescription: hero?.ultimateDescription ?? "",
    techniqueSlots: clampInt(
      hero?.techniqueSlots ?? base.techniqueSlots,
      0,
      HERO_LIMITS.techniqueSlots,
    ),
    equipment: normalizeItems(hero?.equipment),
    abilities: normalizeItems(hero?.abilities),
    traits,
    haki: traits.includes("haki")
      ? (hero?.haki ?? []).filter((kind): kind is HakiKind => HAKI_IDS.has(kind))
      : [],
    weaknesses: Array.isArray(hero?.weaknesses)
      ? hero.weaknesses.filter((line) => typeof line === "string")
      : [],
  };
}

export function thresholdCaption(hero: HeroCard): string {
  const box = hero.lifeThreshold;
  if (hero.lifeThresholdBias === "above") {
    return `Más fuerte por encima de la casilla ${box}.`;
  }
  if (hero.lifeThresholdBias === "below") {
    return `Más fuerte por debajo de la casilla ${box}.`;
  }
  return `Más fuerte justo en la casilla ${box}.`;
}

export function isStrongLifeBox(box: number, hero: HeroCard): boolean {
  if (hero.lifeThresholdBias === "exact") return box === hero.lifeThreshold;
  if (hero.lifeThresholdBias === "above") return box > hero.lifeThreshold;
  return box < hero.lifeThreshold;
}

export function traitLabel(id: HeroTraitId): string {
  return HERO_TRAITS.find((trait) => trait.id === id)?.label ?? id;
}

export function hakiLabel(id: HakiKind): string {
  return HAKI_KINDS.find((kind) => kind.id === id)?.label ?? id;
}
