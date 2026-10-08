export type CardType =
  | "energia"
  | "golpe"
  | "unica"
  | "voluntad_i"
  | "voluntad_ii"
  | "tecnica_i"
  | "tecnica_ii"
  | "tecnica_iii"
  | "nakama";

export interface Card {
  id: string;
  quantity: number;
  name: string;
  cardEngineId: string;
  deck: string;
  type: CardType;
  title: string;
  description: string;
  cost: number;
  code: string;
  imageFileName: string;
  imageBlobKey?: string;
  /** ID de la carta Astro Knights de la que esta es proxy One Piece. */
  astroKnightsCardId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  templateIds: Record<CardType, string>;
  iconAssetIds: Partial<Record<CardType, string>>;
  imageCategory: string;
  defaultDeck: string;
}

export interface StoredImage {
  key: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
}
