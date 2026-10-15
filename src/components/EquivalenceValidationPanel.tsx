import { useMemo, useState } from "react";
import type { AstroKnightsCard, AstroKnightsCity } from "../data/astroKnights";
import type { OnePieceCard, OnePieceCity } from "../data/onePiece";
import { OpCardEditModal } from "./OpCardEditModal";
import { OpCityEditModal } from "./OpCityEditModal";
import { CardPreview, previewFromAk, previewFromOp } from "./CardPreview";
import { EditableArtProposal } from "./EditableArtProposal";
import { ThemeChipPicker } from "./ThemeChipPicker";

type Tab = "cartas" | "ciudades";
type StatusFilter = "all" | "pending" | "validated";

interface Props {
  opCards: OnePieceCard[];
  opCities: OnePieceCity[];
  akCards: AstroKnightsCard[];
  akCities: AstroKnightsCity[];
  onSaveCard: (card: OnePieceCard, previousId: string) => Promise<void>;
  onSaveCity: (city: OnePieceCity, previousId: string) => Promise<void>;
  onToggleCardValidated: (card: OnePieceCard) => void;
  onToggleCityValidated: (city: OnePieceCity) => void;
}

export function EquivalenceValidationPanel({
  opCards,
  opCities,
  akCards,
  akCities,
  onSaveCard,
  onSaveCity,
  onToggleCardValidated,
  onToggleCityValidated,
}: Props) {
  const [tab, setTab] = useState<Tab>("cartas");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [editingCard, setEditingCard] = useState<OnePieceCard | null>(null);
  const [editingCity, setEditingCity] = useState<OnePieceCity | null>(null);

  const akCardById = useMemo(
    () => Object.fromEntries(akCards.map((c) => [c.id, c])),
    [akCards],
  );
  const akCityById = useMemo(
    () => Object.fromEntries(akCities.map((c) => [c.id, c])),
    [akCities],
  );

  const cardStats = useMemo(() => {
    const validated = opCards.filter((c) => c.equivalenceValidated).length;
    return { total: opCards.length, validated, pending: opCards.length - validated };
  }, [opCards]);

  const cityStats = useMemo(() => {
    const validated = opCities.filter((c) => c.equivalenceValidated).length;
    return { total: opCities.length, validated, pending: opCities.length - validated };
  }, [opCities]);

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return opCards.filter((c) => {
      if (status === "pending" && c.equivalenceValidated) return false;
      if (status === "validated" && !c.equivalenceValidated) return false;
      if (!q) return true;
      const ak = akCardById[c.astroKnightsCardId];
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.imageProposal.toLowerCase().includes(q) ||
        c.astroKnightsCardId.includes(q) ||
        (ak?.name.toLowerCase().includes(q) ?? false) ||
        (ak?.description.toLowerCase().includes(q) ?? false)
      );
    });
  }, [opCards, search, status, akCardById]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return opCities.filter((c) => {
      if (status === "pending" && c.equivalenceValidated) return false;
      if (status === "validated" && !c.equivalenceValidated) return false;
      if (!q) return true;
      const ak = akCityById[c.astroKnightsCityId];
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.imageProposal.toLowerCase().includes(q) ||
        c.astroKnightsCityId.includes(q) ||
        (ak?.name.toLowerCase().includes(q) ?? false) ||
        (ak?.description.toLowerCase().includes(q) ?? false)
      );
    });
  }, [opCities, search, status, akCityById]);

  const stats = tab === "cartas" ? cardStats : cityStats;

  return (
    <section className="ak-panel">
      <div className="ak-panel__header">
        <div>
          <h2>Validar equivalencias</h2>
          <p className="ak-panel__sub">
            Compara cada proxy One Piece con su carta Astro Knights. Marca el
            checkbox cuando el reskin ya esté decidido y pensado. Clic en la
            propuesta de arte OP para editarla.
          </p>
          <p className="ak-panel__legend">
            <span className="eq-badge eq-badge--ok">✓</span>{" "}
            {stats.validated} validadas
            <span className="eq-badge eq-badge--pending">○</span>{" "}
            {stats.pending} pendientes
            <span className="muted">· {stats.total} total</span>
          </p>
        </div>
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
            Cartas ({cardStats.pending}/{cardStats.total})
          </button>
          <button
            type="button"
            role="tab"
            className={tab === "ciudades" ? "tab tab--active" : "tab"}
            aria-selected={tab === "ciudades"}
            onClick={() => setTab("ciudades")}
          >
            Ciudades ({cityStats.pending}/{cityStats.total})
          </button>
        </div>

        <input
          className="input"
          type="search"
          placeholder="Buscar OP, AK, descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Estado de validación"
        >
          <option value="all">Todas</option>
          <option value="pending">Solo pendientes</option>
          <option value="validated">Solo validadas</option>
        </select>
      </div>

      {tab === "cartas" ? (
        <div className="eq-list">
          {filteredCards.map((card) => {
            const ak = akCardById[card.astroKnightsCardId];
            return (
              <article
                key={card.id}
                className={
                  card.equivalenceValidated
                    ? "eq-row eq-row--cards eq-row--validated"
                    : "eq-row eq-row--cards"
                }
              >
                <label className="eq-row__check" title="Proxy/reskin decidido">
                  <input
                    type="checkbox"
                    checked={card.equivalenceValidated}
                    onChange={() => onToggleCardValidated(card)}
                  />
                  <span className="eq-row__check-label">
                    {card.equivalenceValidated ? "Validada" : "Pendiente"}
                  </span>
                </label>

                <div className="eq-pair eq-pair--previews">
                  <div className="eq-col eq-col--op">
                    <p className="eq-side__eyebrow">One Piece</p>
                    <CardPreview card={previewFromOp(card)} />
                    <ThemeChipPicker
                      compact
                      value={card.themeChips ?? []}
                      onChange={(themeChips) => {
                        void onSaveCard({ ...card, themeChips }, card.id);
                      }}
                    />
                    <EditableArtProposal
                      value={card.imageProposal}
                      onSave={async (next) => {
                        await onSaveCard(
                          { ...card, imageProposal: next },
                          card.id,
                        );
                      }}
                    />
                  </div>
                  <div className="eq-col eq-col--ak">
                    <p className="eq-side__eyebrow">Astro Knights</p>
                    {ak ? (
                      <CardPreview card={previewFromAk(ak)} />
                    ) : (
                      <p className="muted">
                        Sin carta AK enlazada ({card.astroKnightsCardId}).
                      </p>
                    )}
                  </div>
                </div>

                <div className="eq-row__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingCard(card)}
                  >
                    Editar OP
                  </button>
                </div>
              </article>
            );
          })}
          {filteredCards.length === 0 && (
            <p className="empty">Sin resultados con estos filtros.</p>
          )}
        </div>
      ) : (
        <div className="eq-list">
          {filteredCities.map((city) => {
            const ak = akCityById[city.astroKnightsCityId];
            return (
              <article
                key={city.id}
                className={
                  city.equivalenceValidated
                    ? "eq-row eq-row--validated"
                    : "eq-row"
                }
              >
                <label className="eq-row__check" title="Proxy/reskin decidido">
                  <input
                    type="checkbox"
                    checked={city.equivalenceValidated}
                    onChange={() => onToggleCityValidated(city)}
                  />
                  <span className="eq-row__check-label">
                    {city.equivalenceValidated ? "Validada" : "Pendiente"}
                  </span>
                </label>

                <div className="eq-pair">
                  <div className="eq-side eq-side--op">
                    <p className="eq-side__eyebrow">One Piece</p>
                    <h3>
                      <span className="mono tiny">{city.id}</span> {city.name}
                    </h3>
                    <p className="eq-side__body">{city.description}</p>
                    <EditableArtProposal
                      value={city.imageProposal}
                      onSave={async (next) => {
                        await onSaveCity(
                          { ...city, imageProposal: next },
                          city.id,
                        );
                      }}
                    />
                    <p className="muted tiny">
                      Vida {city.life} · carga {city.initialCharge}
                    </p>
                  </div>
                  <div className="eq-side eq-side--ak">
                    <p className="eq-side__eyebrow">Astro Knights</p>
                    <h3>
                      <span className="mono tiny">{city.astroKnightsCityId}</span>{" "}
                      {ak?.name ?? "— sin enlace —"}
                    </h3>
                    <p className="eq-side__body">
                      {ak?.description ?? "No hay ciudad AK con ese id."}
                    </p>
                    {ak && (
                      <p className="muted tiny">
                        Vida {ak.life} · carga {ak.initialCharge}
                      </p>
                    )}
                  </div>
                </div>

                <div className="eq-row__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingCity(city)}
                  >
                    Editar OP
                  </button>
                </div>
              </article>
            );
          })}
          {filteredCities.length === 0 && (
            <p className="empty">Sin resultados con estos filtros.</p>
          )}
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
    </section>
  );
}
