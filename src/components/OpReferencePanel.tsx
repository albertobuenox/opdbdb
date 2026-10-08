import { useMemo, useState } from "react";
import type { OnePieceCard, OnePieceCity } from "../data/onePiece";
import { OpCardEditModal } from "./OpCardEditModal";
import { OpCityEditModal } from "./OpCityEditModal";
import {
  ArtPromptModal,
  type ArtPromptTarget,
} from "./ArtPromptModal";

type Tab = "cartas" | "ciudades";

interface Props {
  cards: OnePieceCard[];
  cities: OnePieceCity[];
  /** Mapa id AK → nombre, para mostrar el enlace. */
  akCardNames: Record<string, string>;
  akCityNames: Record<string, string>;
  onSaveCard: (card: OnePieceCard, previousId: string) => Promise<void>;
  onSaveCity: (city: OnePieceCity, previousId: string) => Promise<void>;
  onDeleteCard: (card: OnePieceCard) => void;
  onDeleteCity: (city: OnePieceCity) => void;
  onReseed: () => void;
}

function CategoryDot({ category }: { category: OnePieceCard["category"] }) {
  const isVoluntad = category === "voluntad";
  return (
    <span
      className={
        isVoluntad ? "type-dot type-dot--energia" : "type-dot type-dot--arma"
      }
      title={isVoluntad ? "Voluntad" : "Técnica"}
      aria-label={isVoluntad ? "Voluntad" : "Técnica"}
    />
  );
}

function deckLabel(deck: OnePieceCard["deck"]) {
  return deck === "basico_heroe" ? "Básico héroe" : "Mercado";
}

function typeLabel(type: OnePieceCard["type"]) {
  if (type === "voluntad") return "Voluntad";
  if (type === "tecnica") return "Técnica";
  return "Tesoro";
}

export function OpReferencePanel({
  cards,
  cities,
  akCardNames,
  akCityNames,
  onSaveCard,
  onSaveCity,
  onDeleteCard,
  onDeleteCity,
  onReseed,
}: Props) {
  const [tab, setTab] = useState<Tab>("cartas");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deck, setDeck] = useState("");
  const [editingCard, setEditingCard] = useState<OnePieceCard | null>(null);
  const [editingCity, setEditingCity] = useState<OnePieceCity | null>(null);
  const [artTarget, setArtTarget] = useState<ArtPromptTarget | null>(null);

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (category && c.category !== category) return false;
      if (deck && c.deck !== deck) return false;
      if (!q) return true;
      const akName = akCardNames[c.astroKnightsCardId] ?? "";
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.imageProposal.toLowerCase().includes(q) ||
        c.astroKnightsCardId.includes(q) ||
        akName.toLowerCase().includes(q)
      );
    });
  }, [cards, search, category, deck, akCardNames]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cities.filter((c) => {
      if (!q) return true;
      const akName = akCityNames[c.astroKnightsCityId] ?? "";
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.imageProposal.toLowerCase().includes(q) ||
        akName.toLowerCase().includes(q)
      );
    });
  }, [cities, search, akCityNames]);

  return (
    <section className="ak-panel">
      <div className="ak-panel__header">
        <div>
          <h2>Base One Piece</h2>
          <p className="ak-panel__sub">
            Voluntad = eventos/motivaciones (☀). Básica: motivación simple.
            Mercado I: eventos importantes. Mercado II: ambiciones, muertes y
            noticias que lo cambian todo. Efectos iguales a Astro Knights.
          </p>
          <p className="ak-panel__legend">
            <span className="type-dot type-dot--energia" aria-hidden /> Voluntad
            <span className="type-dot type-dot--arma" aria-hidden /> Técnicas
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onReseed}>
          Re-seed One Piece
        </button>
      </div>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={tab === "cartas" ? "tab tab--active" : "tab"}
            aria-selected={tab === "cartas"}
            onClick={() => setTab("cartas")}
          >
            Cartas ({cards.length})
          </button>
          <button
            type="button"
            role="tab"
            className={tab === "ciudades" ? "tab tab--active" : "tab"}
            aria-selected={tab === "ciudades"}
            onClick={() => setTab("ciudades")}
          >
            Ciudades ({cities.length})
          </button>
        </div>

        <input
          className="input"
          type="search"
          placeholder="Buscar nombre, id, AK…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tab === "cartas" && (
          <>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas las familias</option>
              <option value="voluntad">Voluntad</option>
              <option value="tecnicas">Técnicas</option>
            </select>
            <select
              className="input"
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
            >
              <option value="">Todos los mazos</option>
              <option value="basico_heroe">Básico héroe</option>
              <option value="mercado">Mercado</option>
            </select>
          </>
        )}
      </div>

      {tab === "cartas" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Mazo</th>
                <th>Nivel</th>
                <th>Coste</th>
                <th>AK</th>
                <th>Descripción</th>
                <th>Imagen propuesta</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id}>
                  <td className="mono">{card.id}</td>
                  <td>
                    <strong>{card.name}</strong>
                  </td>
                  <td>
                    <span className="type-cell">
                      <CategoryDot category={card.category} />
                      {typeLabel(card.type)}
                    </span>
                  </td>
                  <td>{deckLabel(card.deck)}</td>
                  <td>{card.level ?? "—"}</td>
                  <td>{card.cost === null ? "—" : card.cost}</td>
                  <td>
                    <div className="mono tiny">{card.astroKnightsCardId}</div>
                    <div className="muted tiny">
                      {akCardNames[card.astroKnightsCardId] ?? "—"}
                    </div>
                  </td>
                  <td className="desc-cell">{card.description}</td>
                  <td className="desc-cell desc-cell--art">{card.imageProposal}</td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() =>
                        setArtTarget({
                          id: card.id,
                          name: card.name,
                          kind: "card",
                          artPromptCharacters: card.artPromptCharacters,
                          artPromptBackground: card.artPromptBackground,
                          imageProposal: card.imageProposal,
                        })
                      }
                    >
                      Art prompt
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setEditingCard(card)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger-ghost"
                      onClick={() => onDeleteCard(card)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={10} className="empty">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Vida</th>
                <th>Carga</th>
                <th>Niveles</th>
                <th>AK</th>
                <th>Descripción</th>
                <th>Imagen propuesta</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredCities.map((city) => (
                <tr key={city.id}>
                  <td className="mono">{city.id}</td>
                  <td>
                    <strong>{city.name}</strong>
                  </td>
                  <td>{city.life}</td>
                  <td>{city.initialCharge}</td>
                  <td className="mono">{city.chargeLevels.join(" → ")}</td>
                  <td>
                    <div className="mono tiny">{city.astroKnightsCityId}</div>
                    <div className="muted tiny">
                      {akCityNames[city.astroKnightsCityId] ?? "—"}
                    </div>
                  </td>
                  <td className="desc-cell">{city.description}</td>
                  <td className="desc-cell desc-cell--art">{city.imageProposal}</td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() =>
                        setArtTarget({
                          id: city.id,
                          name: city.name,
                          kind: "city",
                          artPromptCharacters: city.artPromptCharacters,
                          artPromptBackground: city.artPromptBackground,
                          imageProposal: city.imageProposal,
                        })
                      }
                    >
                      Art prompt
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setEditingCity(city)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger-ghost"
                      onClick={() => onDeleteCity(city)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCities.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <OpCardEditModal
        open={Boolean(editingCard)}
        initial={editingCard}
        onClose={() => setEditingCard(null)}
        onSave={onSaveCard}
      />
      <OpCityEditModal
        open={Boolean(editingCity)}
        initial={editingCity}
        onClose={() => setEditingCity(null)}
        onSave={onSaveCity}
      />
      <ArtPromptModal
        open={Boolean(artTarget)}
        target={artTarget}
        onClose={() => setArtTarget(null)}
        onSave={async (target, characters, background) => {
          if (target.kind === "card") {
            const card = cards.find((c) => c.id === target.id);
            if (!card) throw new Error("Carta no encontrada.");
            await onSaveCard(
              {
                ...card,
                artPromptCharacters: characters,
                artPromptBackground: background,
              },
              card.id,
            );
          } else {
            const city = cities.find((c) => c.id === target.id);
            if (!city) throw new Error("Ciudad no encontrada.");
            await onSaveCity(
              {
                ...city,
                artPromptCharacters: characters,
                artPromptBackground: background,
              },
              city.id,
            );
          }
        }}
      />
    </section>
  );
}
