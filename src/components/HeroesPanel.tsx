import { useMemo, useState } from "react";
import type { HeroCard, HeroTraitId } from "../data/heroes";
import {
  HERO_TRAITS,
  blankHero,
  normalizeHero,
  slugHeroId,
  traitLabel,
} from "../data/heroes";
import { HeroBoard } from "./HeroBoard";

interface Props {
  heroes: HeroCard[];
  onSave: (hero: HeroCard, previousId: string) => Promise<void>;
  onDelete: (hero: HeroCard) => Promise<void>;
}

function cleanList(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function cleanItems(items: HeroCard["equipment"]): HeroCard["equipment"] {
  return items
    .map((item) => ({
      ...item,
      name: item.name.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.name || item.description);
}

export function HeroesPanel({ heroes, onSave, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [trait, setTrait] = useState<HeroTraitId | "">("");
  const [draft, setDraft] = useState<HeroCard | null>(null);
  const [previousId, setPreviousId] = useState("");
  const [idManual, setIdManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return heroes.filter((hero) => {
      if (trait && !hero.traits.includes(trait)) return false;
      if (!query) return true;
      const blob = [
        hero.name,
        hero.id,
        hero.ultimateName,
        hero.ultimateDescription,
        hero.lifeThresholdText,
        ...hero.weaknesses,
        ...hero.traits.map((id) => traitLabel(id)),
        ...hero.equipment.flatMap((item) => [item.name, item.description]),
        ...hero.abilities.flatMap((item) => [item.name, item.description]),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    });
  }, [heroes, search, trait]);

  function openNew() {
    setDraft(blankHero());
    setPreviousId("");
    setIdManual(false);
    setError(null);
  }

  function openExisting(hero: HeroCard) {
    setDraft(normalizeHero(hero));
    setPreviousId(hero.id);
    setIdManual(true);
    setError(null);
  }

  function updateDraft(next: HeroCard, source?: "name" | "id") {
    if (source === "id") {
      setIdManual(true);
      setDraft(next);
      return;
    }
    if (source === "name" && !idManual) {
      setDraft({ ...next, id: slugHeroId(next.name) });
      return;
    }
    setDraft(next);
  }

  async function handleSave() {
    if (!draft) return;
    const hero = normalizeHero({
      ...draft,
      id: draft.id.trim(),
      name: draft.name.trim(),
      lifeThresholdText: draft.lifeThresholdText.trim(),
      ultimateName: draft.ultimateName.trim(),
      ultimateDescription: draft.ultimateDescription.trim(),
      equipment: cleanItems(draft.equipment),
      abilities: cleanItems(draft.abilities),
      weaknesses: cleanList(draft.weaknesses),
    });
    if (!hero.id || !hero.name) {
      setError("El nombre y el id son obligatorios.");
      return;
    }
    const unnamed = [...hero.equipment, ...hero.abilities].find((item) => !item.name);
    if (unnamed) {
      setError("Cada equipo y cada habilidad necesita un nombre.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(hero, previousId);
      setDraft(hero);
      setPreviousId(hero.id);
      setIdManual(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function removeSaved(hero: HeroCard) {
    const label = hero.name || hero.id || "este héroe";
    const ok = window.confirm(`¿Borrar la carta de «${label}»?`);
    if (!ok) return;
    await onDelete(hero);
  }

  async function removeDraft() {
    if (!draft) return;
    const label = draft.name || draft.id || "este héroe";
    const ok = window.confirm(
      previousId
        ? `¿Borrar la carta de «${label}»?`
        : `¿Descartar la carta de «${label}»?`,
    );
    if (!ok) return;
    if (previousId) await onDelete({ ...draft, id: previousId });
    setDraft(null);
    setPreviousId("");
  }

  if (draft) {
    return (
      <section className="ak-panel">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div className="hm-editor__bar">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setDraft(null);
                setPreviousId("");
              }}
            >
              Volver al listado
            </button>
            <div className="hm-editor__actions">
              <button
                type="button"
                className="btn btn--danger-ghost"
                onClick={() => void removeDraft()}
              >
                Borrar
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Guardando…" : "Guardar héroe"}
              </button>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <HeroBoard hero={draft} editing onChange={updateDraft} />
        </form>
      </section>
    );
  }

  return (
    <section className="ak-panel">
      <div className="ak-panel__header">
        <div>
          <h2>Cartas de héroe</h2>
          <p className="ak-panel__sub">
            Cada héroe tiene un marcador de vida con umbral, un marcador de
            ultimate que se activa en su casilla máxima, slots de técnicas,
            equipo, habilidades, rasgos y puntos débiles.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openNew}>
          Nuevo héroe
        </button>
      </div>

      <div className="toolbar">
        <input
          className="input"
          type="search"
          placeholder="Buscar nombre, ultimate, rasgo…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="input"
          value={trait}
          onChange={(event) => setTrait(event.target.value as HeroTraitId | "")}
        >
          <option value="">Todos los rasgos</option>
          {HERO_TRAITS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {heroes.length === 0 ? (
        <p className="hm-empty">Todavía no hay héroes. Crea la primera carta.</p>
      ) : filtered.length === 0 ? (
        <p className="hm-empty">Ningún héroe coincide con la búsqueda.</p>
      ) : (
        <div className="hm-gallery">
          {filtered.map((hero) => (
            <article key={hero.id} className="hm-card">
              <HeroBoard hero={hero} />
              <div className="hm-card__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => openExisting(hero)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn--danger-ghost"
                  onClick={() => void removeSaved(hero)}
                >
                  Borrar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
