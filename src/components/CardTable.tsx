import { useEffect, useMemo, useState } from "react";
import type { Card } from "../types";
import { CARD_TYPES } from "../data/cardTypes";
import { TypeBadge } from "./TypeBadge";
import { getImage } from "../db/indexedDb";

interface CardTableProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  search: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

function Thumb({ card }: { card: Card }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    async function load() {
      if (!card.imageBlobKey) {
        setUrl(null);
        return;
      }
      const img = await getImage(card.imageBlobKey);
      if (cancelled) return;
      if (!img) {
        setUrl(null);
        return;
      }
      const objectUrl = URL.createObjectURL(img.blob);
      revoked = objectUrl;
      setUrl(objectUrl);
    }

    void load();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [card.imageBlobKey, card.updatedAt]);

  if (!url) {
    return <div className="thumb thumb--empty" aria-hidden />;
  }
  return <img className="thumb" src={url} alt="" />;
}

export function CardTable({
  cards,
  onEdit,
  onDelete,
  search,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
}: CardTableProps) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (typeFilter && c.type !== typeFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [cards, search, typeFilter]);

  return (
    <section className="table-section">
      <div className="toolbar-filters">
        <label className="field field--inline">
          <span>Buscar</span>
          <input
            type="search"
            placeholder="Título, código, nombre…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <label className="field field--inline">
          <span>Tipo</span>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
          >
            <option value="">Todos</option>
            {CARD_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <p className="filter-count">
          {filtered.length} / {cards.length} cartas
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No hay cartas que coincidan.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap desktop-only">
            <table className="card-table">
              <thead>
                <tr>
                  <th>Arte</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Coste</th>
                  <th>Código</th>
                  <th>Mazo</th>
                  <th>Qty</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((card) => (
                  <tr key={card.id}>
                    <td>
                      <Thumb card={card} />
                    </td>
                    <td>
                      <div className="cell-title">{card.title || "—"}</div>
                      <div className="cell-sub">{card.name}</div>
                    </td>
                    <td>
                      <TypeBadge type={card.type} />
                    </td>
                    <td>{card.cost}</td>
                    <td>
                      <code>{card.code || "—"}</code>
                    </td>
                    <td>{card.deck || "—"}</td>
                    <td>{card.quantity}</td>
                    <td className="cell-actions">
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => onEdit(card)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger-ghost"
                        onClick={() => onDelete(card)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards mobile-only">
            {filtered.map((card) => (
              <article key={card.id} className="mobile-card">
                <div className="mobile-card__top">
                  <Thumb card={card} />
                  <div>
                    <h3>{card.title || "Sin título"}</h3>
                    <TypeBadge type={card.type} />
                  </div>
                </div>
                <dl className="mobile-card__meta">
                  <div>
                    <dt>Coste</dt>
                    <dd>{card.cost}</dd>
                  </div>
                  <div>
                    <dt>Código</dt>
                    <dd>{card.code || "—"}</dd>
                  </div>
                  <div>
                    <dt>Mazo</dt>
                    <dd>{card.deck || "—"}</dd>
                  </div>
                </dl>
                <div className="mobile-card__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onEdit(card)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger-ghost"
                    onClick={() => onDelete(card)}
                  >
                    Borrar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
