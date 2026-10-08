import type { OnePieceCard } from "./types";

/**
 * Proxies One Piece de las cartas Astro Knights.
 *
 * Voluntad (eventos / motivaciones):
 * - Básica: motivación simple del personaje.
 * - Mercado lvl 1: eventos importantes (liberar pueblos, nakamas, Vivi…).
 * - Mercado lvl 2: ambiciones mayores, muertes, sueños, noticias que lo cambian todo.
 *
 * Terminología: ⚡ → ☀ · combustible → voluntad · arma → técnica · planeta natal → ciudad · tecnología → tesoro
 */
export const ONE_PIECE_CARDS: OnePieceCard[] = [
  // ── Voluntad básica: motivación simple ───────────────────────────────────
  {
    id: "OP-076",
    name: "Motivación",
    type: "voluntad",
    description: "Obtienes 1 ☀.",
    cost: null,
    deck: "basico_heroe",
    category: "voluntad",
    level: null,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Primer plano de un personaje mirando al horizonte con una sonrisa determinada; fondo simple (cielo o mar); sensación de «quiero intentarlo», sin épica todavía.",
    astroKnightsCardId: "076",
  },

  // ── Voluntad mercado lvl 1: eventos importantes ──────────────────────────
  {
    id: "OP-010",
    name: "¡Vivi!",
    type: "voluntad",
    description:
      "Obtienes 2 ☀. Puedes destruir la carta superior de cualquier mazo de suministro.",
    cost: 2,
    deck: "mercado",
    category: "voluntad",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Despedida en Alabasta: la tripulación y el pueblo levantan el brazo formando una X en la arena; Vivi al fondo; polvo dorado y emoción contenida.",
    astroKnightsCardId: "010",
  },
  {
    id: "OP-012",
    name: "Nakamas Unidos",
    type: "voluntad",
    description:
      "Obtienes 2 ☀. Si dispones del máximo de tus espacios, obtienes 3 ☀ en su lugar.",
    cost: 3,
    deck: "mercado",
    category: "voluntad",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "La tripulación del Sombrero de Paja junta, hombro con hombro, lista para pelear; poses icónicas de cada uno; sensación de equipo completo al máximo.",
    astroKnightsCardId: "012",
  },
  {
    id: "OP-014",
    name: "Pueblo Liberado",
    type: "voluntad",
    description: "Obtienes 2 ☀. Puedes destruir una voluntad de tu mano.",
    cost: 3,
    deck: "mercado",
    category: "voluntad",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Fiesta de liberación (Alabasta/Dressrosa): gente celebrando, banderas, lágrimas de alivio; el tirano caído fuera de foco; luz cálida de victoria colectiva.",
    astroKnightsCardId: "014",
  },
  {
    id: "OP-016",
    name: "Bandera del Sombrero",
    type: "voluntad",
    description: "COMPRAR: la ciudad recarga 1. Obtienes 2 ☀.",
    cost: 2,
    deck: "mercado",
    category: "voluntad",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "La Jolly Roger del Sombrero de Paja ondeando sobre un mástil o tejado; siluetas de civiles protegidos debajo; símbolo de que «esta tierra tiene protección».",
    astroKnightsCardId: "016",
  },
  {
    id: "OP-018",
    name: "Juramento de Nakama",
    type: "voluntad",
    description:
      "Obtienes 2 ☀. O Puedes destruir esta carta para obtener una técnica que cueste 5 ☀ o menos.",
    cost: 3,
    deck: "mercado",
    category: "voluntad",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Escena de unirse a la tripulación: apretón de manos o brindis en cubierta; Luffy ofreciendo el lugar; sonrisas; el barco al fondo al atardecer.",
    astroKnightsCardId: "018",
  },

  // ── Voluntad mercado lvl 2: ambiciones / golpes duros ─────────────────────
  {
    id: "OP-020",
    name: "Portadas del Mundo",
    type: "voluntad",
    description: "Obtienes 2 ☀. Cualquier jugador recarga.",
    cost: 4,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Primer plano de un periódico del mundo (World Economy News) con titular impactante; manos temblando al leerlo; lluvia o viento; el mundo entero se entera.",
    astroKnightsCardId: "020",
  },
  {
    id: "OP-021",
    name: "¡Quiero vivir!",
    type: "voluntad",
    description: "Obtienes 2 ☀. Cualquier jugador obtiene 1 punto de vida.",
    cost: 4,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Robin en Enies Lobby gritando «¡Quiero vivir!» mientras la tripulación corre hacia ella por el puente; fuego y escombros; desesperación convertida en esperanza.",
    astroKnightsCardId: "021",
  },
  {
    id: "OP-023",
    name: "Rey de los Piratas",
    type: "voluntad",
    description:
      "Obtienes 2 ☀. La próxima vez que obtengas una técnica este turno, puedes colocarla encima de cualquier mazo de aliado.",
    cost: 4,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Luffy (o el héroe) señalando el cielo / el mar y declarando que será el Rey de los Piratas; aliados detrás escuchando; horizonte infinito.",
    astroKnightsCardId: "023",
  },
  {
    id: "OP-025",
    name: "Adiós, Merry",
    type: "voluntad",
    description: "Obtienes 2 ☀. La ciudad recarga.",
    cost: 5,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Funeral de Going Merry: el barco ardiendo en el mar al atardecer; la tripulación de espaldas, llorando; espíritu del barco despidiéndose entre llamas.",
    astroKnightsCardId: "025",
  },
  {
    id: "OP-027",
    name: "La Muerte de Ace",
    type: "voluntad",
    description:
      "Obtienes 3 ☀. Puedes destruir la carta superior de cualquier mazo de suministro.",
    cost: 5,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Marineford: Ace herido en brazos de Luffy, sonrisa débil, cenizas de magma alrededor; contraste frío del hielo y el calor residual; silencio tras el golpe.",
    astroKnightsCardId: "027",
  },
  {
    id: "OP-029",
    name: "El One Piece",
    type: "voluntad",
    description:
      "Obtienes 3 ☀. Cuando obtengas un tesoro este turno, colócalo en tu mano.",
    cost: 6,
    deck: "mercado",
    category: "voluntad",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Roger riendo en la ejecución (o un mapa/Laugh Tale en silueta) y la frase «el One Piece… ¡existe!»; multitud en shock; el sueño de toda una era encendido.",
    astroKnightsCardId: "029",
  },

  // ── Técnicas básicas ─────────────────────────────────────────────────────
  {
    id: "OP-094",
    name: "Puñetazo Básico",
    type: "tecnica",
    description: "ATAQUE: causa 1 de daño.",
    cost: null,
    deck: "basico_heroe",
    category: "tecnicas",
    level: null,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Puñetazo simple a cámara: brazo extendido, impacto pequeño, expresión concentrada; sin Haki ni efectos enormes; técnica de principiante.",
    astroKnightsCardId: "094",
  },

  // ── Técnicas mercado lvl 1 ───────────────────────────────────────────────
  {
    id: "OP-031",
    name: "Disparo Disruptor",
    type: "tecnica",
    description:
      "ATAQUE: causa 2 de daño. Puedes destruir la carta superior de cualquier mazo de suministro.",
    cost: 2,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Disparo a media distancia (Usopp/francotirador): proyectil que rompe un cartel o suministro enemigo; humo y precisión; sensación de saboteo.",
    astroKnightsCardId: "031",
  },
  {
    id: "OP-033",
    name: "Escudo de Armamento",
    type: "tecnica",
    description: "ATAQUE: causa 2 de daño. La ciudad recarga.",
    cost: 3,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Brazo o arma ennegrecidos con Haki de Armamento bloqueando un golpe y contraatacando; destellos negros; la ciudad protegida al fondo.",
    astroKnightsCardId: "033",
  },
  {
    id: "OP-035",
    name: "Onda Repulsora",
    type: "tecnica",
    description: "ATAQUE: causa 2 de daño. La ciudad obtiene 1 punto de vida.",
    cost: 3,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Onda de choque que empuja enemigos lejos de civiles; héroe en el centro con palma abierta; gente a salvo detrás; polvo y viento.",
    astroKnightsCardId: "035",
  },
  {
    id: "OP-037",
    name: "Aguja de Observación",
    type: "tecnica",
    description:
      "ATAQUE: causa 2 de daño y obtienes un espacio. O ATAQUE: causa 3 de daño.",
    cost: 4,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Ojos brillantes de Observation Haki; trayectoria del ataque anticipada en líneas; el personaje esquiva/golpea en el punto exacto.",
    astroKnightsCardId: "037",
  },
  {
    id: "OP-039",
    name: "Ráfaga Encadenada",
    type: "tecnica",
    description: "EQUIPAR: causa 1 de daño. ATAQUE: causa 3 de daño.",
    cost: 4,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Combo de golpes en secuencia (afterimages): primer toque al equipar y ráfaga final potente; estilo pelea rápida tipo Luffy/Sanji.",
    astroKnightsCardId: "039",
  },
  {
    id: "OP-040",
    name: "Alfanje Fulgurante",
    type: "tecnica",
    description: "ATAQUE: causa 3 de daño. Recarga.",
    cost: 4,
    deck: "mercado",
    category: "tecnicas",
    level: 1,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Corte de espada con destello (Zoro/espadachín): arco brillante, chispas; el espadachín recupera aliento tras el tajo; dinámica diagonal.",
    astroKnightsCardId: "040",
  },

  // ── Técnicas mercado lvl 2 ───────────────────────────────────────────────
  {
    id: "OP-042",
    name: "Explosión Fractal",
    type: "tecnica",
    description:
      "ATAQUE: causa 3 de daño. Después, causa 2 de daño a un esbirro. (Los efectos que modifican el daño afectan a ambos tipos de daño que causa esta técnica).",
    cost: 5,
    deck: "mercado",
    category: "tecnicas",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Explosión que se divide en dos frentes: golpe al jefe y esquirlas a un subordinado; fuego/humo en forma de estallido partido.",
    astroKnightsCardId: "042",
  },
  {
    id: "OP-044",
    name: "Cañón Demoledor",
    type: "tecnica",
    description: "ATAQUE: causa 4 de daño. Puedes destruir una carta de tu mano.",
    cost: 5,
    deck: "mercado",
    category: "tecnicas",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Impacto demoledor tipo Gear/arma pesada: puño o cañón que destroza el suelo; el héroe «quema» algo (carta) como precio del golpe.",
    astroKnightsCardId: "044",
  },
  {
    id: "OP-046",
    name: "Martillo de Guerra",
    type: "tecnica",
    description:
      "ATAQUE: causa 4 de daño. Puedes devolver una técnica de tu pila de descarte a tu mano.",
    cost: 5,
    deck: "mercado",
    category: "tecnicas",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Martillazo o golpe a dos manos que hace temblar el campo; un arma/técnica caída vuelve a la mano del héroe en un destello.",
    astroKnightsCardId: "046",
  },
  {
    id: "OP-048",
    name: "Dispersión de Haki",
    type: "tecnica",
    description:
      "ATAQUE: causa 2 de daño. Incrementa ese daño en 2 por cada otra técnica que tengas equipada.",
    cost: 6,
    deck: "mercado",
    category: "tecnicas",
    level: 2,
    quantity: 2,
    needsReview: false,
    imageProposal:
      "Aura de Haki que se amplifica con cada arma/técnica equipada visible alrededor; más siluetas de armas = más presión; ondas negras crecientes.",
    astroKnightsCardId: "048",
  },
  {
    id: "OP-050",
    name: "Pacificadora",
    type: "tecnica",
    description:
      "ATAQUE: causa 5 de daño. Si esto derrota a un esbirro, cualquier jugador recarga y obtiene 1 punto de vida.",
    cost: 6,
    deck: "mercado",
    category: "tecnicas",
    level: 2,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Golpe decisivo que derriba a un subordinado; aliados respiran aliviados y recuperan fuerzas; contraste violencia/alivio.",
    astroKnightsCardId: "050",
  },

  // ── Técnicas mercado lvl 3 ───────────────────────────────────────────────
  {
    id: "OP-051",
    name: "Puño Distorsionador",
    type: "tecnica",
    description: "ATAQUE: causa 5 de daño. Cada aliado roba una carta.",
    cost: 7,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Puño que deforma el aire (Gear/advanced Haki); aliados al fondo ganando impulso/cartas; onda que «abre camino» al equipo.",
    astroKnightsCardId: "051",
  },
  {
    id: "OP-052",
    name: "Vibración Interna",
    type: "tecnica",
    description: "ATAQUE: causa 6 de daño. Recarga. La ciudad recarga.",
    cost: 7,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Golpe de vibración interna (estilo advanced Armament): impacto que atraviesa defensa; héroe y ciudad «recargan» con aura tras el golpe.",
    astroKnightsCardId: "052",
  },
  {
    id: "OP-053",
    name: "Hoja Curva Flamígera",
    type: "tecnica",
    description:
      "EQUIPAR: puedes destruir una carta de tu mano o pila de descarte. ATAQUE: causa 6 de daño.",
    cost: 7,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Espada curva envuelta en llamas (estilo samurái/Wano); al desenvainar se quema un recuerdo/carta; tajo ígneo final espectacular.",
    astroKnightsCardId: "053",
  },
  {
    id: "OP-054",
    name: "Disparo Acelerado",
    type: "tecnica",
    description:
      "ATAQUE: cualquier aliado roba una carta. Después, causa daño igual al número de cartas de la mano de ese jugador.",
    cost: 7,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Francotirador/aliado recibe munición o info (roba carta) y dispara con potencia según «cuánto tiene en la mano»; trayectoria supersónica.",
    astroKnightsCardId: "054",
  },
  {
    id: "OP-055",
    name: "Onda Perturbadora",
    type: "tecnica",
    description:
      "EQUIPAR: devuelve una voluntad que hayas jugado este turno a tu mano. ATAQUE: causa 6 de daño.",
    cost: 8,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Onda de Conqueror/presión que «devuelve» una chispa de voluntad a la mano y luego estalla en un golpe devastador; aura púrpura/negra.",
    astroKnightsCardId: "055",
  },
  {
    id: "OP-056",
    name: "Eco Devastador",
    type: "tecnica",
    description:
      "ATAQUE: causa 7 de daño, dividido como quieras entre el Jefe y cualquier cantidad de esbirros.",
    cost: 8,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Ataque que se multiplica en ecos: rayos/ondas golpeando al jefe y a varios esbirros a la vez; control total del campo de batalla.",
    astroKnightsCardId: "056",
  },
  {
    id: "OP-057",
    name: "Cañón de Fusión",
    type: "tecnica",
    description: "ATAQUE: causa 9 de daño.",
    cost: 8,
    deck: "mercado",
    category: "tecnicas",
    level: 3,
    quantity: 1,
    needsReview: false,
    imageProposal:
      "Finisher absoluto: cañón/puño final a máxima potencia (King Punch / Bajrang-like); cielo roto, un solo objetivo, daño brutal limpio.",
    astroKnightsCardId: "057",
  },
];
