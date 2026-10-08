import { useEffect, useId, useState, type FormEvent } from "react";
import { ModalPortal } from "./ModalPortal";
import type { AstroKnightsCity } from "../data/astroKnights";

interface Props {
  open: boolean;
  initial: AstroKnightsCity | null;
  onClose: () => void;
  onSave: (city: AstroKnightsCity, previousId: string) => Promise<void>;
}

function blank(): AstroKnightsCity {
  return {
    id: "",
    name: "",
    description: "",
    life: 0,
    initialCharge: 0,
    chargeLevels: [0, 1, 2],
    needsReview: false,
    sourceImage: "",
  };
}

export function AkCityEditModal({ open, initial, onClose, onSave }: Props) {
  const titleId = useId();
  const [values, setValues] = useState<AstroKnightsCity>(blank());
  const [levelsText, setLevelsText] = useState("0, 1, 2");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !initial) return;
    setValues({ ...initial });
    setLevelsText(initial.chargeLevels.join(", "));
    setError(null);
  }, [open, initial]);

  if (!open || !initial) return null;

  const previousId = initial.id;

  function update<K extends keyof AstroKnightsCity>(
    key: K,
    value: AstroKnightsCity[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.id.trim()) {
      setError("El ID es obligatorio.");
      return;
    }
    if (!values.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const chargeLevels = levelsText
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n));

    if (!chargeLevels.length) {
      setError("Indica al menos un nivel de carga.");
      return;
    }

    const city: AstroKnightsCity = {
      ...values,
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description.trim(),
      sourceImage: values.sourceImage.trim(),
      life: Number(values.life) || 0,
      initialCharge: Number(values.initialCharge) || 0,
      chargeLevels,
    };

    setSaving(true);
    setError(null);
    try {
      await onSave(city, previousId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalPortal open>
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId}>Editar ciudad AK</h2>
          <button
            type="button"
            className="btn btn--icon"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <form className="modal__body form-grid" onSubmit={(e) => void handleSubmit(e)}>
          <label className="field">
            <span>ID</span>
            <input
              className="mono"
              value={values.id}
              onChange={(e) => update("id", e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Nombre</span>
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Vida</span>
            <input
              type="number"
              min={0}
              value={values.life}
              onChange={(e) => update("life", Number(e.target.value) || 0)}
            />
          </label>

          <label className="field">
            <span>Carga inicial</span>
            <input
              type="number"
              min={0}
              value={values.initialCharge}
              onChange={(e) =>
                update("initialCharge", Number(e.target.value) || 0)
              }
            />
          </label>

          <label className="field field--span2">
            <span>Niveles de carga</span>
            <input
              value={levelsText}
              onChange={(e) => setLevelsText(e.target.value)}
              placeholder="0, 1, 2, 3"
            />
            <small>Números separados por coma.</small>
          </label>

          <label className="field field--span2">
            <span>Descripción</span>
            <textarea
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>

          <label className="field field--span2">
            <span>Imagen de referencia</span>
            <input
              value={values.sourceImage}
              onChange={(e) => update("sourceImage", e.target.value)}
            />
          </label>

          <label className="check field--span2">
            <input
              type="checkbox"
              checked={values.needsReview}
              onChange={(e) => update("needsReview", e.target.checked)}
            />
            Marcar ⚠ para revisión manual
          </label>

          {error && <p className="form-error field--span2">{error}</p>}

          <div className="modal__footer field--span2">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
