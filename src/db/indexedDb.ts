import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AppSettings, Card, CardType, StoredImage } from "../types";
import { CARD_TYPES } from "../data/cardTypes";
import {
  ASTRO_KNIGHTS_CARDS,
  ASTRO_KNIGHTS_CITIES,
  type AstroKnightsCard,
  type AstroKnightsCity,
} from "../data/astroKnights";
import {
  ONE_PIECE_CARDS,
  ONE_PIECE_CITIES,
  normalizeThemeChips,
  type OnePieceCard,
  type OnePieceCity,
} from "../data/onePiece";
import { normalizeHero, type HeroCard } from "../data/heroes";

interface OnePieceDeckBuildingDB extends DBSchema {
  cards: {
    key: string;
    value: Card;
    indexes: { byUpdated: string; byAkCardId: string };
  };
  images: {
    key: string;
    value: StoredImage;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  akCities: {
    key: string;
    value: AstroKnightsCity;
  };
  akCards: {
    key: string;
    value: AstroKnightsCard;
    indexes: {
      byDeck: string;
      byCategory: string;
      byNeedsReview: number;
    };
  };
  opCities: {
    key: string;
    value: OnePieceCity;
    indexes: { byAkCityId: string };
  };
  opCards: {
    key: string;
    value: OnePieceCard;
    indexes: {
      byDeck: string;
      byCategory: string;
      byAkCardId: string;
    };
  };
  heroes: {
    key: string;
    value: HeroCard;
  };
}

const DB_NAME = "one-piece-deck-building";
const DB_VERSION = 3;
const SETTINGS_KEY = "main";
const AK_SEED_VERSION = 2;
const OP_SEED_VERSION = 2;
const AK_SEED_STORAGE_KEY = "opdb-ak-seed-version";
const OP_SEED_STORAGE_KEY = "opdb-op-seed-version";

export function emptyTemplateIds(): Record<CardType, string> {
  return Object.fromEntries(CARD_TYPES.map((t) => [t.id, ""])) as Record<
    CardType,
    string
  >;
}

export function defaultSettings(): AppSettings {
  return {
    templateIds: emptyTemplateIds(),
    iconAssetIds: {},
    imageCategory: "Custom",
    defaultDeck: "One Piece Deck Building",
  };
}

let dbPromise: Promise<IDBPDatabase<OnePieceDeckBuildingDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<OnePieceDeckBuildingDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("cards")) {
          const cards = db.createObjectStore("cards", { keyPath: "id" });
          cards.createIndex("byUpdated", "updatedAt");
          cards.createIndex("byAkCardId", "astroKnightsCardId");
        }
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
        if (!db.objectStoreNames.contains("akCities")) {
          db.createObjectStore("akCities", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("akCards")) {
          const ak = db.createObjectStore("akCards", { keyPath: "id" });
          ak.createIndex("byDeck", "deck");
          ak.createIndex("byCategory", "category");
          ak.createIndex("byNeedsReview", "needsReview");
        }
        if (!db.objectStoreNames.contains("opCities")) {
          const opCities = db.createObjectStore("opCities", { keyPath: "id" });
          opCities.createIndex("byAkCityId", "astroKnightsCityId");
        }
        if (!db.objectStoreNames.contains("opCards")) {
          const op = db.createObjectStore("opCards", { keyPath: "id" });
          op.createIndex("byDeck", "deck");
          op.createIndex("byCategory", "category");
          op.createIndex("byAkCardId", "astroKnightsCardId");
        }
        if (!db.objectStoreNames.contains("heroes")) {
          db.createObjectStore("heroes", { keyPath: "id" });
        }
      },
    }).then(async (db) => {
      await ensureAkSeed(db);
      await ensureOpSeed(db);
      return db;
    });
  }
  return dbPromise;
}

async function writeAkSeed(db: IDBPDatabase<OnePieceDeckBuildingDB>) {
  const tx = db.transaction(["akCities", "akCards"], "readwrite");
  await tx.objectStore("akCities").clear();
  await tx.objectStore("akCards").clear();
  await Promise.all([
    ...ASTRO_KNIGHTS_CITIES.map((c) => tx.objectStore("akCities").put(c)),
    ...ASTRO_KNIGHTS_CARDS.map((c) => tx.objectStore("akCards").put(c)),
    tx.done,
  ]);
  try {
    localStorage.setItem(AK_SEED_STORAGE_KEY, String(AK_SEED_VERSION));
  } catch {
    /* ignore */
  }
}

async function writeOpSeed(db: IDBPDatabase<OnePieceDeckBuildingDB>) {
  const tx = db.transaction(["opCities", "opCards"], "readwrite");
  await tx.objectStore("opCities").clear();
  await tx.objectStore("opCards").clear();
  await Promise.all([
    ...ONE_PIECE_CITIES.map((c) => tx.objectStore("opCities").put(c)),
    ...ONE_PIECE_CARDS.map((c) => tx.objectStore("opCards").put(c)),
    tx.done,
  ]);
  try {
    localStorage.setItem(OP_SEED_STORAGE_KEY, String(OP_SEED_VERSION));
  } catch {
    /* ignore */
  }
}

async function ensureAkSeed(db: IDBPDatabase<OnePieceDeckBuildingDB>) {
  const cityCount = await db.count("akCities");
  const cardCount = await db.count("akCards");
  let storedVersion = 0;
  try {
    storedVersion = Number(localStorage.getItem(AK_SEED_STORAGE_KEY) || "0");
  } catch {
    storedVersion = 0;
  }
  if (storedVersion >= AK_SEED_VERSION && cityCount > 0 && cardCount > 0) {
    return;
  }
  await writeAkSeed(db);
}

async function ensureOpSeed(db: IDBPDatabase<OnePieceDeckBuildingDB>) {
  const cityCount = await db.count("opCities");
  const cardCount = await db.count("opCards");
  let storedVersion = 0;
  try {
    storedVersion = Number(localStorage.getItem(OP_SEED_STORAGE_KEY) || "0");
  } catch {
    storedVersion = 0;
  }
  if (storedVersion >= OP_SEED_VERSION && cityCount > 0 && cardCount > 0) {
    return;
  }
  await writeOpSeed(db);
}

export async function reseedAstroKnights(): Promise<void> {
  const db = await getDb();
  await writeAkSeed(db);
}

export async function reseedOnePiece(): Promise<void> {
  const db = await getDb();
  await writeOpSeed(db);
}

export async function getAllAkCities(): Promise<AstroKnightsCity[]> {
  const db = await getDb();
  const rows = await db.getAll("akCities");
  return rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function getAllAkCards(): Promise<AstroKnightsCard[]> {
  const db = await getDb();
  const rows = await db.getAll("akCards");
  return rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function getAkCard(id: string): Promise<AstroKnightsCard | undefined> {
  const db = await getDb();
  return db.get("akCards", id);
}

export async function putAkCard(card: AstroKnightsCard): Promise<void> {
  const db = await getDb();
  await db.put("akCards", card);
}

export async function deleteAkCard(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("akCards", id);
}

export async function saveAkCard(
  card: AstroKnightsCard,
  previousId?: string,
): Promise<void> {
  const db = await getDb();
  if (previousId && previousId !== card.id) {
    const clash = await db.get("akCards", card.id);
    if (clash) throw new Error(`Ya existe una carta con id «${card.id}».`);
    const tx = db.transaction("akCards", "readwrite");
    await tx.store.delete(previousId);
    await tx.store.put(card);
    await tx.done;
    return;
  }
  await db.put("akCards", card);
}

export async function putAkCity(city: AstroKnightsCity): Promise<void> {
  const db = await getDb();
  await db.put("akCities", city);
}

export async function deleteAkCity(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("akCities", id);
}

export async function saveAkCity(
  city: AstroKnightsCity,
  previousId?: string,
): Promise<void> {
  const db = await getDb();
  if (previousId && previousId !== city.id) {
    const clash = await db.get("akCities", city.id);
    if (clash) throw new Error(`Ya existe una ciudad con id «${city.id}».`);
    const tx = db.transaction("akCities", "readwrite");
    await tx.store.delete(previousId);
    await tx.store.put(city);
    await tx.done;
    return;
  }
  await db.put("akCities", city);
}

function normalizeOpCard(card: OnePieceCard): OnePieceCard {
  return {
    ...card,
    equivalenceValidated: Boolean(card.equivalenceValidated),
    themeChips: normalizeThemeChips(card.themeChips),
  };
}

function normalizeOpCity(city: OnePieceCity): OnePieceCity {
  return {
    ...city,
    equivalenceValidated: Boolean(city.equivalenceValidated),
  };
}

export async function getAllOpCities(): Promise<OnePieceCity[]> {
  const db = await getDb();
  const rows = await db.getAll("opCities");
  return rows
    .map(normalizeOpCity)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function getAllOpCards(): Promise<OnePieceCard[]> {
  const db = await getDb();
  const rows = await db.getAll("opCards");
  return rows
    .map(normalizeOpCard)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export async function putOpCard(card: OnePieceCard): Promise<void> {
  const db = await getDb();
  await db.put("opCards", card);
}

export async function deleteOpCard(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("opCards", id);
}

export async function saveOpCard(
  card: OnePieceCard,
  previousId?: string,
): Promise<void> {
  const db = await getDb();
  if (previousId && previousId !== card.id) {
    const clash = await db.get("opCards", card.id);
    if (clash) throw new Error(`Ya existe una carta OP con id «${card.id}».`);
    const tx = db.transaction("opCards", "readwrite");
    await tx.store.delete(previousId);
    await tx.store.put(card);
    await tx.done;
    return;
  }
  await db.put("opCards", card);
}

export async function putOpCity(city: OnePieceCity): Promise<void> {
  const db = await getDb();
  await db.put("opCities", city);
}

export async function deleteOpCity(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("opCities", id);
}

export async function saveOpCity(
  city: OnePieceCity,
  previousId?: string,
): Promise<void> {
  const db = await getDb();
  if (previousId && previousId !== city.id) {
    const clash = await db.get("opCities", city.id);
    if (clash) throw new Error(`Ya existe una ciudad OP con id «${city.id}».`);
    const tx = db.transaction("opCities", "readwrite");
    await tx.store.delete(previousId);
    await tx.store.put(city);
    await tx.done;
    return;
  }
  await db.put("opCities", city);
}

export async function getAllHeroes(): Promise<HeroCard[]> {
  const db = await getDb();
  const rows = await db.getAll("heroes");
  return rows
    .map(normalizeHero)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function saveHero(hero: HeroCard, previousId = ""): Promise<void> {
  const db = await getDb();
  const stored = normalizeHero(hero);
  const renaming = Boolean(previousId) && previousId !== stored.id;
  if (!previousId || renaming) {
    const clash = await db.get("heroes", stored.id);
    if (clash) throw new Error(`Ya existe un héroe con id «${stored.id}».`);
  }
  if (renaming) {
    const tx = db.transaction("heroes", "readwrite");
    await tx.store.delete(previousId);
    await tx.store.put(stored);
    await tx.done;
    return;
  }
  await db.put("heroes", stored);
}

export async function deleteHero(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("heroes", id);
}

export async function getAllCards(): Promise<Card[]> {
  const db = await getDb();
  const cards = await db.getAll("cards");
  return cards.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getCard(id: string): Promise<Card | undefined> {
  const db = await getDb();
  return db.get("cards", id);
}

export async function putCard(card: Card): Promise<void> {
  const db = await getDb();
  await db.put("cards", card);
}

export async function deleteCard(id: string): Promise<void> {
  const db = await getDb();
  const card = await db.get("cards", id);
  if (card?.imageBlobKey) {
    await db.delete("images", card.imageBlobKey);
  }
  await db.delete("cards", id);
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDb();
  const stored = await db.get("settings", SETTINGS_KEY);
  if (!stored) {
    const defaults = defaultSettings();
    await db.put("settings", defaults, SETTINGS_KEY);
    return defaults;
  }
  return {
    ...defaultSettings(),
    ...stored,
    templateIds: { ...emptyTemplateIds(), ...stored.templateIds },
    iconAssetIds: { ...stored.iconAssetIds },
  };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDb();
  await db.put("settings", settings, SETTINGS_KEY);
}

export async function putImage(image: StoredImage): Promise<void> {
  const db = await getDb();
  await db.put("images", image);
}

export async function getImage(key: string): Promise<StoredImage | undefined> {
  const db = await getDb();
  return db.get("images", key);
}

export async function deleteImage(key: string): Promise<void> {
  const db = await getDb();
  await db.delete("images", key);
}

export async function getAllImages(): Promise<StoredImage[]> {
  const db = await getDb();
  return db.getAll("images");
}
