import type { OnePieceCity } from "./types";

/**
 * Ciudades One Piece — proxies de los planetas natales de Astro Knights.
 * Efectos idénticos; terminología OP (ciudad en lugar de planeta natal).
 */
export const ONE_PIECE_CITIES: OnePieceCity[] = [
  {
    id: "OP-186",
    name: "Isla Gyojin",
    description:
      "Activar durante la fase principal de cualquier jugador: Los jugadores recuperan colectivamente dos cartas de sus pilas de descarte a sus manos.",
    life: 26,
    initialCharge: 0,
    chargeLevels: [0, 1, 2],
    needsReview: false,
    equivalenceValidated: false,
    imageProposal:
      "Vista submarina de Isla Gyojin: coral, burbujas y los edificios de Coral Hill; luz filtrada azul-verde; sensación de ciudad viva bajo el mar.",
    astroKnightsCityId: "186",
  },
  {
    id: "OP-187",
    name: "Egghead",
    description:
      "Activar durante la fase principal de cualquier jugador: Los jugadores recargan colectivamente cinco veces.",
    life: 27,
    initialCharge: 0,
    chargeLevels: [0, 1, 2, 3],
    needsReview: false,
    equivalenceValidated: false,
    imageProposal:
      "Egghead desde el mar: lab futuro, Labophase brillante, Frontier Dome y siluetas de Vegapunk/Seraphim; estética tech fría y luminosa.",
    astroKnightsCityId: "187",
  },
  {
    id: "OP-188",
    name: "Dressrosa",
    description:
      "Activar durante la fase principal de cualquier jugador: Causa 4 de daño. Seguidamente, causa 2 de daño.",
    life: 28,
    initialCharge: 0,
    chargeLevels: [0, 1, 2, 3],
    needsReview: false,
    equivalenceValidated: false,
    imageProposal:
      "Dressrosa al atardecer: Coliseo Corrida, flores, torres y la sombra del palacio de Doflamingo; color cálido, fiesta y peligro.",
    astroKnightsCityId: "188",
  },
  {
    id: "OP-189",
    name: "Wano",
    description:
      "Activar durante la fase principal de cualquier jugador: Ataca con la técnica de cualquier jugador. Incrementa su daño en 3. (Coloca esa técnica en la pila de descarte de ese jugador).",
    life: 30,
    initialCharge: 0,
    chargeLevels: [0, 1, 2],
    needsReview: false,
    equivalenceValidated: false,
    imageProposal:
      "Wano: montañas, flor de cerezo, Onigashima al fondo y samuráis/piratas listos para la asalto; épica feudal y tensión de guerra.",
    astroKnightsCityId: "189",
  },
];
