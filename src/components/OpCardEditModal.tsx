import { useEffect, useId, useState, type FormEvent } from "react";
import { ModalPortal } from "./ModalPortal";
import type {
  OpCardType,
  OpCategory,
  OpDeck,
  OnePieceCard,
} from "../data/onePiece";

interface Props {
  open: boolean;
  initial: OnePieceCard | null;
  onClose: () => void;
  onSave: (card: OnePieceCard, previousId: string) => Promise<void>;
}

function categoryForType(type: OpCardType): OpCategory {
  return type === "voluntad" ? "voluntad" : "tecnicas";
}

function blank(): OnePieceCard {
  return {
    id: "",
    name: "",
    type: "voluntad",
    description: "",
    cost: null,
    deck: "basico_heroe",
    category: "voluntad",
    level: null,
    quantity: 1,
    needsReview: false,
    imageProposal: "",
    astroKnightsCardId: "",
  };
}

export function OpCardEditModal({ open, initial, onClose, onSave }: Props) {
  const titleId = useId();
  const [values, setValues] = useState<OnePieceCard>(blank());
  const [costEmpty, setCostEmpty] = useState(true);
  const [levelEmpty, setLevelEmpty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !initial) return;
    setValues({ ...initial });
    setCostEmpty(initial.cost === null);
    setLevelEmpty(initial.level === null);
    setError(null);
  }, [open, initial]);

  if (!open || !initial) return null;

  const previousId = initial.id;

  function update<K extends keyof OnePieceCard>(key: K, value: OnePieceCard[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "type") next.category = categoryForType(value as OpCardType);
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
    if (!values.id.trim() || !values.name.trim()) {
      setError("ID y nombre son obligatorios.");
      return;
    }
    const card: OnePieceCard = {
      ...values,
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description.trim(),
      imageProposal: values.imageProposal.trim(),
      astroKnightsCardId: values.astroKnightsCardId.trim(),
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
          <h2 id={titleId}>Editar carta One Piece</h2>
          <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        <form className="modal__body form-grid" onSubmit={(e) => void handleSubmit(e)}>
          <label className="field">
            <span>ID</span>
            <input className="mono" value={values.id} onChange={(e) => update("id", e.target.value)} required />
          </label>
          <label className="field">
            <span>Nombre</span>
            <input value={values.name} onChange={(e) => update("name", e.target.value)} required />
          </label>
          <label className="field">
            <span>Tipo</span>
            <select value={values.type} onChange={(e) => update("type", e.target.value as OpCardType)}>
              <option value="voluntad">Voluntad</option>
              <option value="tecnica">Técnica</option>
              <option value="tesoro">Tesoro</option>
            </select>
          </label>
          <label className="field">
            <span>Mazo</span>
            <select value={values.deck} onChange={(e) => update("deck", e.target.value as OpDeck)}>
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
                disabled={costEmpty}
                value={costEmpty ? "" : (values.cost ?? 0)}
                onChange={(e) => update("cost", Number(e.target.value) || 0)}
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
                Sin coste
              </label>
            </div>
          </label>
          <label className="field">
            <span>Nivel</span>
            <div className="field-row">
              <input
                type="number"
                min={1}
                max={3}
                disabled={levelEmpty}
                value={levelEmpty ? "" : (values.level ?? 1)}
                onChange={(e) => update("level", Number(e.target.value) || 1)}
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
              onChange={(e) => update("quantity", Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <label className="field">
            <span>ID Astro Knights</span>
            <input
              className="mono"
              value={values.astroKnightsCardId}
              onChange={(e) => update("astroKnightsCardId", e.target.value)}
            />
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
            <span>Propuesta de imagen</span>
            <textarea
              rows={3}
              value={values.imageProposal}
              onChange={(e) => update("imageProposal", e.target.value)}
              placeholder="Qué debería mostrar el arte de la carta…"
            />
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
