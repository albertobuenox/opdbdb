/** Tipos de la base Astro Knights (juego original). */

export type AkCardType = "combustible" | "arma" | "tecnologia";

/** Mazo de pertenencia: básicas del héroe vs mercado. */
export type AkDeck = "basico_heroe" | "mercado";

/** Familia temática (energía = combustible, técnicas = armas/tecnología). */
export type AkCategory = "energia" | "tecnicas";

export interface AstroKnightsCity {
  id: string;
  name: string;
  description: string;
  /** Puntos de vida del planeta natal. */
  life: number;
  /** Valor de carga al empezar la partida. */
  initialCharge: number;
  /** Valores del track de carga (p. ej. [0,1,2,3]). */
  chargeLevels: number[];
  /** Texto dudoso por calidad de foto: revisar a mano. */
  needsReview: boolean;
  /** Ruta relativa de la foto de referencia. */
  sourceImage: string;
  /** FK a la ciudad One Piece (proxy). */
  onePieceCityId?: string | null;
}

export interface AstroKnightsCard {
  id: string;
  name: string;
  type: AkCardType;
  description: string;
  /**
   * Coste de compra. Las básicas del héroe no se compran (`null`);
   * en la carta física puede aparecer un 0.
   */
  cost: number | null;
  deck: AkDeck;
  category: AkCategory;
  /** Nivel de mercado (1–3). `null` en básicas. */
  level: number | null;
  /** Copias físicas en el set (según fotos). */
  quantity: number;
  /** IDs impresos de cada copia. */
  printIds: string[];
  needsReview: boolean;
  sourceImage: string;
  /** FK futura a la carta One Piece (proxy). */
  onePieceCardId?: string | null;
}
