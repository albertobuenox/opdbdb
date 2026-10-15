import type { HeroCard, HakiKind, HeroTraitId } from "../data/heroes";
import {
  HAKI_KINDS,
  HERO_LIMITS,
  HERO_TRAITS,
  THRESHOLD_BIASES,
  clampInt,
  hakiLabel,
  isStrongLifeBox,
  newLoadoutItem,
  thresholdCaption,
  traitLabel,
} from "../data/heroes";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface Props {
  hero: HeroCard;
  editing?: boolean;
  onChange?: (next: HeroCard, source?: "name" | "id") => void;
}

function range(from: number, to: number): number[] {
  const values: number[] = [];
  for (let n = from; n <= to; n += 1) values.push(n);
  return values;
}

function orderedToggle<T extends string>(current: T[], id: T, catalog: T[]): T[] {
  const selected = new Set(current);
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  return catalog.filter((item) => selected.has(item));
}

export function HeroBoard({ hero, editing = false, onChange }: Props) {
  function commit(next: HeroCard, source?: "name" | "id") {
    onChange?.(next, source);
  }

  function setLifeMax(lifeMax: number) {
    const next = clampInt(lifeMax, 1, HERO_LIMITS.lifeMax);
    commit({
      ...hero,
      lifeMax: next,
      lifeThreshold: clampInt(hero.lifeThreshold, 1, next),
    });
  }

  function toggleTrait(id: HeroTraitId) {
    const traits = orderedToggle(
      hero.traits,
      id,
      HERO_TRAITS.map((trait) => trait.id),
    );
    commit({
      ...hero,
      traits,
      haki: traits.includes("haki") ? hero.haki : [],
    });
  }

  function toggleHaki(id: HakiKind) {
    const haki = orderedToggle(
      hero.haki,
      id,
      HAKI_KINDS.map((kind) => kind.id),
    );
    const traits =
      haki.length > 0 && !hero.traits.includes("haki")
        ? orderedToggle(hero.traits, "haki", HERO_TRAITS.map((trait) => trait.id))
        : hero.traits;
    commit({ ...hero, traits, haki });
  }

  const strongBoxes = range(1, hero.lifeMax).filter((box) => isStrongLifeBox(box, hero));
  const emptyStrongZone =
    hero.lifeThresholdBias !== "exact" && strongBoxes.length === 0;

  return (
    <article className={editing ? "hm" : "hm hm--preview"}>
      <header className="hm__head">
        <div className="hm__identity">
          {editing ? (
            <>
              <label className="field">
                <span>Nombre</span>
                <input
                  value={hero.name}
                  placeholder="Nombre del héroe"
                  autoComplete="off"
                  onChange={(event) =>
                    commit({ ...hero, name: event.target.value }, "name")
                  }
                />
              </label>
              <label className="field">
                <span>Id</span>
                <input
                  className="mono"
                  value={hero.id}
                  placeholder="heroe-…"
                  autoComplete="off"
                  onChange={(event) =>
                    commit({ ...hero, id: event.target.value }, "id")
                  }
                />
              </label>
            </>
          ) : (
            <>
              <h3 className="hm__name">{hero.name || "Sin nombre"}</h3>
              <p className="hm__id mono">{hero.id}</p>
            </>
          )}
        </div>

        <div className="hm__traits">
          <p className="hm__label">Rasgos</p>
          {editing ? (
            <div className="hm-traits" role="group" aria-label="Rasgos">
              {HERO_TRAITS.map((trait) => {
                const on = hero.traits.includes(trait.id);
                return (
                  <button
                    key={trait.id}
                    type="button"
                    className={on ? "hm-trait hm-trait--on" : "hm-trait"}
                    aria-pressed={on}
                    title={trait.hint}
                    onClick={() => toggleTrait(trait.id)}
                  >
                    {trait.label}
                  </button>
                );
              })}
            </div>
          ) : hero.traits.length === 0 ? (
            <p className="muted tiny">Sin rasgos</p>
          ) : (
            <div className="hm-traits">
              {hero.traits.map((id) => (
                <span key={id} className="hm-trait hm-trait--on">
                  {traitLabel(id)}
                </span>
              ))}
            </div>
          )}

          {(editing ? hero.traits.includes("haki") : hero.haki.length > 0) && (
            <div className="hm__haki">
              <p className="hm__label">Haki</p>
              {editing ? (
                <div className="hm-traits" role="group" aria-label="Tipo de haki">
                  {HAKI_KINDS.map((kind) => {
                    const on = hero.haki.includes(kind.id);
                    return (
                      <button
                        key={kind.id}
                        type="button"
                        className={on ? "hm-trait hm-trait--haki" : "hm-trait"}
                        aria-pressed={on}
                        onClick={() => toggleHaki(kind.id)}
                      >
                        {kind.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="hm-traits">
                  {hero.haki.map((id) => (
                    <span key={id} className="hm-trait hm-trait--haki">
                      {hakiLabel(id)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="hm__tracks">
        <section className="hm__panel" aria-label="Vida">
          <div className="hm__panel-head">
            <h4>Vida</h4>
            {editing && (
              <Stepper
                value={hero.lifeMax}
                min={1}
                max={HERO_LIMITS.lifeMax}
                label="vida máxima"
                onChange={setLifeMax}
              />
            )}
          </div>
          <p className="hm__hint">
            Casillas del 1 al {hero.lifeMax}. Lo normal es 10.
            {editing ? " Pulsa una casilla para marcar el umbral." : ""}
          </p>
          <div className="hm-pips" role="group" aria-label="Casillas de vida">
            {range(1, hero.lifeMax).map((box) => {
              const mark = box === hero.lifeThreshold;
              const strong = isStrongLifeBox(box, hero);
              const className = [
                "hm-pip",
                "hm-pip--life",
                mark ? "hm-pip--mark" : "",
                strong ? "hm-pip--strong" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const label = `Vida ${box}${mark ? ", umbral" : ""}${strong ? ", zona fuerte" : ""}`;
              if (!editing) {
                return (
                  <span key={box} className={className} title={label}>
                    {box}
                  </span>
                );
              }
              return (
                <button
                  key={box}
                  type="button"
                  className={className}
                  aria-pressed={mark}
                  aria-label={label}
                  onClick={() => commit({ ...hero, lifeThreshold: box })}
                >
                  {box}
                </button>
              );
            })}
          </div>
          <p className="hm__legend">
            <span className="hm-swatch hm-swatch--strong" aria-hidden /> Zona fuerte
            <span className="hm-swatch hm-swatch--mark" aria-hidden /> Umbral
          </p>
          {editing ? (
            <div className="hm-bias" role="group" aria-label="Fuerza respecto al umbral">
              {THRESHOLD_BIASES.map((bias) => (
                <button
                  key={bias.id}
                  type="button"
                  className={
                    hero.lifeThresholdBias === bias.id
                      ? "hm-bias__btn hm-bias__btn--on"
                      : "hm-bias__btn"
                  }
                  aria-pressed={hero.lifeThresholdBias === bias.id}
                  title={bias.hint}
                  onClick={() => commit({ ...hero, lifeThresholdBias: bias.id })}
                >
                  {bias.label}
                </button>
              ))}
            </div>
          ) : null}
          <p className="hm__caption">{thresholdCaption(hero)}</p>
          {emptyStrongZone && (
            <p className="hm__warn">
              Con el umbral en {hero.lifeThreshold} no hay casillas{" "}
              {hero.lifeThresholdBias === "above" ? "por encima" : "por debajo"}.
            </p>
          )}
          {editing ? (
            <label className="field">
              <span>Efecto del umbral</span>
              <textarea
                rows={3}
                value={hero.lifeThresholdText}
                placeholder="Qué gana en su zona fuerte…"
                onChange={(event) =>
                  commit({ ...hero, lifeThresholdText: event.target.value })
                }
              />
            </label>
          ) : (
            hero.lifeThresholdText && (
              <p className="hm__text">{hero.lifeThresholdText}</p>
            )
          )}
        </section>

        <section className="hm__panel" aria-label="Ultimate">
          <div className="hm__panel-head">
            <h4>Ultimate</h4>
            {editing && (
              <Stepper
                value={hero.ultimateMax}
                min={0}
                max={HERO_LIMITS.ultimateMax}
                label="casilla máxima del ultimate"
                onChange={(ultimateMax) =>
                  commit({
                    ...hero,
                    ultimateMax: clampInt(ultimateMax, 0, HERO_LIMITS.ultimateMax),
                  })
                }
              />
            )}
          </div>
          <p className="hm__hint">
            Del 0 al {hero.ultimateMax}. Lo normal es del 0 al 4. Se activa en la
            casilla máxima.
          </p>
          <div className="hm-pips" role="group" aria-label="Casillas de ultimate">
            {range(0, hero.ultimateMax).map((box) => {
              const activate = box === hero.ultimateMax;
              const className = activate
                ? "hm-pip hm-pip--ulti hm-pip--activate"
                : "hm-pip hm-pip--ulti";
              const label = activate
                ? `Ultimate ${box}, se activa aquí`
                : `Ultimate ${box}`;
              return (
                <span key={box} className={className} title={label}>
                  {box}
                </span>
              );
            })}
          </div>
          <p className="hm__caption">Se activa en la casilla {hero.ultimateMax}.</p>
          {editing ? (
            <>
              <label className="field">
                <span>Nombre del ultimate</span>
                <input
                  value={hero.ultimateName}
                  placeholder="Nombre"
                  autoComplete="off"
                  onChange={(event) =>
                    commit({ ...hero, ultimateName: event.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>Descripción</span>
                <textarea
                  rows={4}
                  value={hero.ultimateDescription}
                  placeholder="Qué ocurre al activarlo…"
                  onChange={(event) =>
                    commit({ ...hero, ultimateDescription: event.target.value })
                  }
                />
              </label>
            </>
          ) : (
            <>
              {hero.ultimateName && <p className="hm__ulti-name">{hero.ultimateName}</p>}
              <p className="hm__text">
                {hero.ultimateDescription || "Sin descripción del ultimate."}
              </p>
            </>
          )}
        </section>
      </div>

      <section className="hm__panel" aria-label="Técnicas">
        <div className="hm__panel-head">
          <h4>Técnicas</h4>
          {editing && (
            <Stepper
              value={hero.techniqueSlots}
              min={0}
              max={HERO_LIMITS.techniqueSlots}
              label="slots de técnicas"
              onChange={(techniqueSlots) =>
                commit({
                  ...hero,
                  techniqueSlots: clampInt(
                    techniqueSlots,
                    0,
                    HERO_LIMITS.techniqueSlots,
                  ),
                })
              }
            />
          )}
        </div>
        <p className="hm__hint">Slots para técnicas. Lo normal son 4.</p>
        {hero.techniqueSlots === 0 ? (
          <p className="muted tiny">Sin slots de técnicas.</p>
        ) : (
          <div className="hm-slots">
            {range(1, hero.techniqueSlots).map((slot) => (
              <div key={slot} className="hm-slot">
                <span>{ROMAN[slot - 1] ?? slot}</span>
                <small>Técnica</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="hm__loadout">
        <LoadoutBlock
          title="Equipo"
          empty="Sin equipo."
          addLabel="Añadir equipo"
          editing={editing}
          items={hero.equipment}
          onChange={(equipment) => commit({ ...hero, equipment })}
        />
        <LoadoutBlock
          title="Habilidades"
          empty="Sin habilidades."
          addLabel="Añadir habilidad"
          editing={editing}
          items={hero.abilities}
          onChange={(abilities) => commit({ ...hero, abilities })}
        />
      </div>

      <section className="hm__panel" aria-label="Puntos débiles">
        <h4>Puntos débiles</h4>
        {editing ? (
          <div className="hm-lines">
            {hero.weaknesses.map((line, index) => (
              <div key={index} className="hm-line">
                <input
                  value={line}
                  placeholder="Punto débil"
                  autoComplete="off"
                  onChange={(event) => {
                    const weaknesses = hero.weaknesses.slice();
                    weaknesses[index] = event.target.value;
                    commit({ ...hero, weaknesses });
                  }}
                />
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label={`Quitar punto débil ${index + 1}`}
                  onClick={() =>
                    commit({
                      ...hero,
                      weaknesses: hero.weaknesses.filter((_, i) => i !== index),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => commit({ ...hero, weaknesses: [...hero.weaknesses, ""] })}
            >
              Añadir punto débil
            </button>
          </div>
        ) : hero.weaknesses.filter((line) => line.trim()).length === 0 ? (
          <p className="muted tiny">Sin puntos débiles.</p>
        ) : (
          <div className="hm-traits">
            {hero.weaknesses
              .filter((line) => line.trim())
              .map((line, index) => (
                <span key={`${line}-${index}`} className="hm-weak">
                  {line}
                </span>
              ))}
          </div>
        )}
      </section>
    </article>
  );
}

function Stepper({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}) {
  return (
    <div className="hm-step">
      <button
        type="button"
        aria-label={`Reducir ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label={`Aumentar ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

function LoadoutBlock({
  title,
  empty,
  addLabel,
  editing,
  items,
  onChange,
}: {
  title: string;
  empty: string;
  addLabel: string;
  editing: boolean;
  items: HeroCard["equipment"];
  onChange: (next: HeroCard["equipment"]) => void;
}) {
  return (
    <section className="hm__panel" aria-label={title}>
      <div className="hm__panel-head">
        <h4>{title}</h4>
        {editing && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onChange([...items, newLoadoutItem()])}
          >
            {addLabel}
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="muted tiny">{empty}</p>
      ) : (
        <ul className="hm-items">
          {items.map((item) => (
            <li key={item.id} className="hm-item">
              {editing ? (
                <>
                  <input
                    value={item.name}
                    placeholder="Nombre"
                    autoComplete="off"
                    onChange={(event) =>
                      onChange(
                        items.map((row) =>
                          row.id === item.id ? { ...row, name: event.target.value } : row,
                        ),
                      )
                    }
                  />
                  <textarea
                    rows={2}
                    value={item.description}
                    placeholder="Efecto"
                    onChange={(event) =>
                      onChange(
                        items.map((row) =>
                          row.id === item.id
                            ? { ...row, description: event.target.value }
                            : row,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="btn btn--danger-ghost"
                    onClick={() => onChange(items.filter((row) => row.id !== item.id))}
                  >
                    Quitar
                  </button>
                </>
              ) : (
                <>
                  <strong>{item.name || "Sin nombre"}</strong>
                  {item.description && <p>{item.description}</p>}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
