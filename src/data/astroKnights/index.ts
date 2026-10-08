export type {
  AkCardType,
  AkCategory,
  AkDeck,
  AstroKnightsCard,
  AstroKnightsCity,
} from "./types";
export { ASTRO_KNIGHTS_CITIES } from "./cities.seed";
export { ASTRO_KNIGHTS_CARDS } from "./cards.seed";

import { ASTRO_KNIGHTS_CARDS } from "./cards.seed";
import { ASTRO_KNIGHTS_CITIES } from "./cities.seed";

export const AK_SEED_META = {
  cities: ASTRO_KNIGHTS_CITIES.length,
  cards: ASTRO_KNIGHTS_CARDS.length,
  needsReviewCards: ASTRO_KNIGHTS_CARDS.filter((c) => c.needsReview).length,
  needsReviewCities: ASTRO_KNIGHTS_CITIES.filter((c) => c.needsReview).length,
} as const;
