import type { AstroKnightsCity } from "./types";

/**
 * Planetas natales (ciudades) — scrapeo de Astro-Knights-References/Ciudades.
 * IDs impresos en carta: 186–189.
 */
export const ASTRO_KNIGHTS_CITIES: AstroKnightsCity[] = [
  {
    id: "186",
    name: "Nueva Atlantis",
    description:
      "Activar durante la fase principal de cualquier jugador: Los jugadores recuperan colectivamente dos cartas de sus pilas de descarte a sus manos.",
    life: 26,
    initialCharge: 0,
    chargeLevels: [0, 1, 2],
    needsReview: false,
    sourceImage:
      "Astro-Knights-References/Ciudades/WhatsApp Image 2026-10-08 at 10.21.33.jpeg",
    onePieceCityId: "OP-186",
  },
  {
    id: "187",
    name: "Nisarin",
    description:
      "Activar durante la fase principal de cualquier jugador: Los jugadores recargan colectivamente cinco veces.",
    life: 27,
    initialCharge: 0,
    chargeLevels: [0, 1, 2, 3],
    needsReview: false,
    sourceImage:
      "Astro-Knights-References/Ciudades/WhatsApp Image 2026-10-08 at 10.21.34 (2).jpeg",
    onePieceCityId: "OP-187",
  },
  {
    id: "188",
    name: "Qaris",
    description:
      "Activar durante la fase principal de cualquier jugador: Causa 4 de daño. Seguidamente, causa 2 de daño.",
    life: 28,
    initialCharge: 0,
    chargeLevels: [0, 1, 2, 3],
    needsReview: false,
    sourceImage:
      "Astro-Knights-References/Ciudades/WhatsApp Image 2026-10-08 at 10.21.34 (3).jpeg",
    onePieceCityId: "OP-188",
  },
  {
    id: "189",
    name: "Ylong",
    description:
      "Activar durante la fase principal de cualquier jugador: Ataca con el arma de cualquier jugador. Incrementa su daño en 3. (Coloca esa arma en la pila de descarte de ese jugador).",
    life: 30,
    initialCharge: 0,
    chargeLevels: [0, 1, 2],
    needsReview: false,
    sourceImage:
      "Astro-Knights-References/Ciudades/WhatsApp Image 2026-10-08 at 10.21.33 (1).jpeg",
    onePieceCityId: "OP-189",
  },
];
