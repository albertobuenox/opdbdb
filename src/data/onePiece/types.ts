/** Tipos de la base One Piece (proxies temáticos de Astro Knights). */

import type { OpThemeChipId } from "./themeChips";

export type { OpThemeChipId } from "./themeChips";

export type OpCardType = "voluntad" | "tecnica" | "tesoro";

export type OpDeck = "basico_heroe" | "mercado";

/** voluntad = energía; tecnicas = armas AK. */
export type OpCategory = "voluntad" | "tecnicas";

export interface OnePieceCity {
  id: string;
  name: string;
  description: string;
  life: number;
  initialCharge: number;
  chargeLevels: number[];
  needsReview: boolean;
  /**
   * Proxy/reskin ya decidido: el equivalente One Piece está pensado y aceptado.
   * Independiente de `needsReview` (calidad de texto/foto).
   */
  equivalenceValidated: boolean;
  /** Propuesta de ilustración para la carta. */
  imageProposal: string;
  /** Personajes del art prompt. */
  artPromptCharacters?: string;
  /** Fondo del art prompt. */
  artPromptBackground?: string;
  /** ID de la ciudad Astro Knights equivalente. */
  astroKnightsCityId: string;
}

export interface OnePieceCard {
  id: string;
  name: string;
  type: OpCardType;
  description: string;
  cost: number | null;
  deck: OpDeck;
  category: OpCategory;
  level: number | null;
  quantity: number;
  needsReview: boolean;
  /**
   * Proxy/reskin ya decidido: el equivalente One Piece está pensado y aceptado.
   * Independiente de `needsReview` (calidad de texto/foto).
   */
  equivalenceValidated: boolean;
  /** Chips de sugerencia temática (Luffy, Zoro, Voluntad…). */
  themeChips: OpThemeChipId[];
  /** Propuesta de ilustración para la carta. */
  imageProposal: string;
  /** Personajes del art prompt. */
  artPromptCharacters?: string;
  /** Fondo del art prompt. */
  artPromptBackground?: string;
  /** ID de la carta Astro Knights equivalente. */
  astroKnightsCardId: string;
}
