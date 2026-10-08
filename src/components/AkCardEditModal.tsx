import { useEffect, useId, useState, type FormEvent } from "react";
import { ModalPortal } from "./ModalPortal";
import type {
  AkCardType,
  AkCategory,
  AkDeck,
  AstroKnightsCard,
} from "../data/astroKnights";

interface Props {
  open: boolean;
  initial: AstroKnightsCard | null;
  onClose: () => void;
  onSave: (card: AstroKnightsCard, previousId: string) => Promise<void>;
}

function categoryForType(type: AkCardType): AkCategory {
  return type === "combustible" ? "energia" : "tecnicas";
}

function blank(): AstroKnightsCard {
  return {
    id: "",
    name: "",
    type: "combustible",
    description: "",
    cost: null,
    deck: "basico_heroe",
    category: "energia",
    level: null,
    quantity: 1,
    printIds: [],
    needsReview: false,
    sourceImage: "",
    onePieceCardId: null,
  };
}

export function AkCardEditModal({ open, initial, onClose, onSave }: Props) {
  const titleId = useId();
  const [values, setValues] = useState<AstroKnightsCard>(blank());
  const [printIdsText, setPrintIdsText] = useState("");
  const [costEmpty, setCostEmpty] = useState(true);
  const [levelEmpty, setLevelEmpty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !initial) return;
    setValues({ ...initial });
    setPrintIdsText(initial.printIds.join(", "));
    setCostEmpty(initial.cost === null);
    setLevelEmpty(initial.level === null);
    setError(null);
  }, [open, initial]);

  if (!open || !initial) return null;

  const previousId = initial.id;

  function update<K extends keyof AstroKnightsCard>(
    key: K,
    value: AstroKnightsCard[K],
  ) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "type") {
        next.category = categoryForType(value as AkCardType);
      }
      if (key === "deck" && value === "basico_heroe") {
        next.cost = null;
        next.level = null;
        setCostEmpty(true);
        setLevelEmpty(true);
      }
      return next;
    });
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

    const printIds = printIdsText
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const card: AstroKnightsCard = {
      ...values,
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description.trim(),
      sourceImage: values.sourceImage.trim(),
      printIds: printIds.length ? printIds : [values.id.trim()],
      quantity: Math.max(1, values.quantity || 1),
      cost: costEmpty ? null : Number(values.cost ?? 0),
      level: levelEmpty ? null : Number(values.level ?? 1),
      category: categoryForType(values.type),
    };

    setSaving(true);
    setError(null);
    try {
      await onSave(card, previousId);
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
        className="modal modal--wide"
        role="dialog"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId}>Editar carta AK</h2>
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
            <span>Tipo</span>
            <select
              value={values.type}
              onChange={(e) => update("type", e.target.value as AkCardType)}
            >
              <option value="combustible">Combustible (energía)</option>
              <option value="arma">Arma</option>
              <option value="tecnologia">Tecnología</option>
            </select>
          </label>

          <label className="field">
            <span>Mazo</span>
            <select
              value={values.deck}
              onChange={(e) => update("deck", e.target.value as AkDeck)}
            >
              <option value="basico_heroe">Básico héroe</option>
              <option value="mercado">Mercado</option>
            </select>
          </label>

          <label className="field">
            <span>Coste</span>
            <div className="field-row">
              <input
                type="number"
                min={0}
                step={1}
                disabled={costEmpty}
                value={costEmpty ? "" : (values.cost ?? 0)}
                onChange={(e) =>
                  update("cost", Number(e.target.value) || 0)
                }
              />
              <label className="check">
                <input
                  type="checkbox"
                  checked={costEmpty}
                  onChange={(e) => {
                    setCostEmpty(e.target.checked);
                    if (e.target.checked) update("cost", null);
                    else update("cost", 0);
                  }}
                />
                Sin coste (básica)
              </label>
            </div>
          </label>

          <label className="field">
            <span>Nivel mercado</span>
            <div className="field-row">
              <input
                type="number"
                min={1}
                max={3}
                step={1}
                disabled={levelEmpty}
                value={levelEmpty ? "" : (values.level ?? 1)}
                onChange={(e) =>
                  update("level", Number(e.target.value) || 1)
                }
              />
              <label className="check">
                <input
                  type="checkbox"
                  checked={levelEmpty}
                  onChange={(e) => {
                    setLevelEmpty(e.target.checked);
                    if (e.target.checked) update("level", null);
                    else update("level", 1);
                  }}
                />
                Sin nivel
              </label>
            </div>
          </label>

          <label className="field">
            <span>Cantidad</span>
            <input
              type="number"
              min={1}
              value={values.quantity}
              onChange={(e) =>
                update("quantity", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>

          <label className="field">
            <span>Print IDs</span>
            <input
              value={printIdsText}
              onChange={(e) => setPrintIdsText(e.target.value)}
              placeholder="010, 011"
            />
            <small>Separados por coma.</small>
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
