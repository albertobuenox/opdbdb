import { useMemo, useState } from "react";
import type { AstroKnightsCard, AstroKnightsCity } from "../data/astroKnights";
import { AkCardEditModal } from "./AkCardEditModal";
import { AkCityEditModal } from "./AkCityEditModal";

type Tab = "cartas" | "ciudades";

interface Props {
  cards: AstroKnightsCard[];
  cities: AstroKnightsCity[];
  onToggleCardReview: (card: AstroKnightsCard) => void;
  onToggleCityReview: (city: AstroKnightsCity) => void;
  onSaveCard: (card: AstroKnightsCard, previousId: string) => Promise<void>;
  onSaveCity: (city: AstroKnightsCity, previousId: string) => Promise<void>;
  onDeleteCard: (card: AstroKnightsCard) => void;
  onDeleteCity: (city: AstroKnightsCity) => void;
  onReseed: () => void;
}

function ReviewBadge({ needsReview }: { needsReview: boolean }) {
  if (!needsReview) return null;
  return (
    <span
      className="review-badge"
      title="Texto interpretado con duda — revisa la foto manualmente"
      aria-label="Necesita revisión manual"
    >
      ⚠
    </span>
  );
}

function CategoryDot({ category }: { category: AstroKnightsCard["category"] }) {
  const isEnergy = category === "energia";
  return (
    <span
      className={isEnergy ? "type-dot type-dot--energia" : "type-dot type-dot--arma"}
      title={isEnergy ? "Energía" : "Arma / técnica"}
      aria-label={isEnergy ? "Energía" : "Arma / técnica"}
    />
  );
}

function deckLabel(deck: AstroKnightsCard["deck"]) {
  return deck === "basico_heroe" ? "Básico héroe" : "Mercado";
}

function typeLabel(type: AstroKnightsCard["type"]) {
  if (type === "combustible") return "Combustible";
  if (type === "arma") return "Arma";
  return "Tecnología";
}

export function AkReferencePanel({
  cards,
  cities,
  onToggleCardReview,
  onToggleCityReview,
  onSaveCard,
  onSaveCity,
  onDeleteCard,
  onDeleteCity,
  onReseed,
}: Props) {
  const [tab, setTab] = useState<Tab>("cartas");
  const [search, setSearch] = useState("");
  const [onlyReview, setOnlyReview] = useState(false);
  const [category, setCategory] = useState("");
  const [deck, setDeck] = useState("");
  const [editingCard, setEditingCard] = useState<AstroKnightsCard | null>(null);
  const [editingCity, setEditingCity] = useState<AstroKnightsCity | null>(null);

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (onlyReview && !c.needsReview) return false;
      if (category && c.category !== category) return false;
      if (deck && c.deck !== deck) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.printIds.some((p) => p.includes(q))
      );
    });
  }, [cards, search, onlyReview, category, deck]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cities.filter((c) => {
      if (onlyReview && !c.needsReview) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [cities, search, onlyReview]);

  const reviewCount =
    cards.filter((c) => c.needsReview).length +
    cities.filter((c) => c.needsReview).length;

  return (
    <section className="ak-panel">
      <div className="ak-panel__header">
        <div>
          <h2>Base Astro Knights</h2>
          <p className="ak-panel__sub">
            Referencia del juego original. Cada carta One Piece se enlazará a un
            registro de aquí.
            {reviewCount > 0 && (
              <>
                {" "}
                <span className="review-badge review-badge--inline">⚠</span>{" "}
                {reviewCount} pendiente(s) de revisión.
              </>
            )}
          </p>
          <p className="ak-panel__legend">
            <span className="type-dot type-dot--energia" aria-hidden /> Energía
            <span className="type-dot type-dot--arma" aria-hidden /> Armas /
            técnicas
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onReseed}>
          Re-seed desde fotos
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
          placeholder="Buscar nombre, id, texto…"
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
              <option value="energia">Energía</option>
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

        <label className="check">
          <input
            type="checkbox"
            checked={onlyReview}
            onChange={(e) => setOnlyReview(e.target.checked)}
          />
          Solo ⚠ revisión
        </label>
      </div>

      {tab === "cartas" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Mazo</th>
                <th>Nivel</th>
                <th>Coste</th>
                <th>Qty</th>
                <th>Descripción</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr
                  key={card.id}
                  className={card.needsReview ? "row--review" : undefined}
                >
                  <td>
                    <button
                      type="button"
                      className={
                        card.needsReview
                          ? "review-toggle review-toggle--on"
                          : "review-toggle"
                      }
                      title={
                        card.needsReview
                          ? "Marcada para revisión — clic para quitar"
                          : "Marcar para revisión"
                      }
                      onClick={() => onToggleCardReview(card)}
                    >
                      <ReviewBadge needsReview={card.needsReview} />
                      {!card.needsReview && (
                        <span className="review-toggle__off">○</span>
                      )}
                    </button>
                  </td>
                  <td className="mono">{card.id}</td>
                  <td>
                    <strong>{card.name}</strong>
                    <div className="muted tiny">
                      prints: {card.printIds.join(", ")}
                    </div>
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
                  <td>{card.quantity}</td>
                  <td className="desc-cell">{card.description}</td>
                  <td className="cell-actions">
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
                <th></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Vida</th>
                <th>Carga inicial</th>
                <th>Niveles</th>
                <th>Descripción</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredCities.map((city) => (
                <tr
                  key={city.id}
                  className={city.needsReview ? "row--review" : undefined}
                >
                  <td>
                    <button
                      type="button"
                      className={
                        city.needsReview
                          ? "review-toggle review-toggle--on"
                          : "review-toggle"
                      }
                      title={
                        city.needsReview
                          ? "Marcada para revisión — clic para quitar"
                          : "Marcar para revisión"
                      }
                      onClick={() => onToggleCityReview(city)}
                    >
                      <ReviewBadge needsReview={city.needsReview} />
                      {!city.needsReview && (
                        <span className="review-toggle__off">○</span>
                      )}
                    </button>
                  </td>
                  <td className="mono">{city.id}</td>
                  <td>
                    <strong>{city.name}</strong>
                  </td>
                  <td>{city.life}</td>
                  <td>{city.initialCharge}</td>
                  <td className="mono">{city.chargeLevels.join(" → ")}</td>
                  <td className="desc-cell">{city.description}</td>
                  <td className="cell-actions">
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
                  <td colSpan={8} className="empty">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AkCardEditModal
        open={Boolean(editingCard)}
        initial={editingCard}
        onClose={() => setEditingCard(null)}
        onSave={onSaveCard}
      />

      <AkCityEditModal
        open={Boolean(editingCity)}
        initial={editingCity}
        onClose={() => setEditingCity(null)}
        onSave={onSaveCity}
      />
    </section>
  );
}
