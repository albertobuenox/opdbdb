export type {
  OpCardType,
  OpCategory,
  OpDeck,
  OpThemeChipId,
  OnePieceCard,
  OnePieceCity,
} from "./types";
export { ONE_PIECE_CITIES } from "./cities.seed";
export { ONE_PIECE_CARDS } from "./cards.seed";
export { ART_PROMPT_INTRO, composeArtPrompt } from "./artPrompt";
export {
  OP_THEME_CHIPS,
  OP_THEME_CHIP_MAP,
  normalizeThemeChips,
  toggleThemeChip,
  type OpThemeChipMeta,
} from "./themeChips";

import { ONE_PIECE_CARDS } from "./cards.seed";
import { ONE_PIECE_CITIES } from "./cities.seed";

export const OP_SEED_META = {
  cities: ONE_PIECE_CITIES.length,
  cards: ONE_PIECE_CARDS.length,
} as const;
