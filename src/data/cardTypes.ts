import type { CardType } from "../types";

export interface CardTypeMeta {
  id: CardType;
  label: string;
  subtitle: string;
  frameColor: string;
  frameColorHex: string;
  costLocked: boolean;
  hasIcon: boolean;
  iconLabel?: string;
}

export const CARD_TYPES: CardTypeMeta[] = [
  {
    id: "energia",
    label: "Energía (básica)",
    subtitle: "Energía",
    frameColor: "morado",
    frameColorHex: "#7c3aed",
    costLocked: true,
    hasIcon: false,
  },
  {
    id: "golpe",
    label: "Golpe (básica)",
    subtitle: "Golpe",
    frameColor: "naranja",
    frameColorHex: "#ea580c",
    costLocked: true,
    hasIcon: false,
  },
  {
    id: "unica",
    label: "Única (personaje)",
    subtitle: "Única",
    frameColor: "rojo",
    frameColorHex: "#dc2626",
    costLocked: true,
    hasIcon: false,
  },
  {
    id: "voluntad_i",
    label: "Voluntad I",
    subtitle: "Voluntad",
    frameColor: "morado",
    frameColorHex: "#7c3aed",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Voluntad I",
  },
  {
    id: "voluntad_ii",
    label: "Voluntad II",
    subtitle: "Voluntad",
    frameColor: "morado",
    frameColorHex: "#7c3aed",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Voluntad II",
  },
  {
    id: "tecnica_i",
    label: "Técnica I",
    subtitle: "Técnica",
    frameColor: "naranja",
    frameColorHex: "#ea580c",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Técnica I",
  },
  {
    id: "tecnica_ii",
    label: "Técnica II",
    subtitle: "Técnica",
    frameColor: "naranja",
    frameColorHex: "#ea580c",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Técnica II",
  },
  {
    id: "tecnica_iii",
    label: "Técnica III",
    subtitle: "Técnica",
    frameColor: "naranja",
    frameColorHex: "#ea580c",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Técnica III",
  },
  {
    id: "nakama",
    label: "Nakama",
    subtitle: "Nakama",
    frameColor: "verde",
    frameColorHex: "#16a34a",
    costLocked: false,
    hasIcon: true,
    iconLabel: "Nakama",
  },
];

export const CARD_TYPE_MAP = Object.fromEntries(
  CARD_TYPES.map((t) => [t.id, t]),
) as Record<CardType, CardTypeMeta>;

export const ICON_CARD_TYPES = CARD_TYPES.filter((t) => t.hasIcon).map(
  (t) => t.id,
);

export function getCardTypeMeta(type: CardType): CardTypeMeta {
  return CARD_TYPE_MAP[type];
}
