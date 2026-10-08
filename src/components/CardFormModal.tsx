import { useEffect, useId, useState, type FormEvent } from "react";
import { ModalPortal } from "./ModalPortal";
import type { Card, CardType } from "../types";
import { CARD_TYPES, getCardTypeMeta } from "../data/cardTypes";
import { getImage } from "../db/indexedDb";
import { sanitizeFileName } from "../lib/imageExport";

export interface CardFormValues {
  quantity: number;
  name: string;
  cardEngineId: string;
  deck: string;
  type: CardType;
  title: string;
  description: string;
  cost: number;
  code: string;
  imageFileName: string;
  imageFile?: File | null;
  clearImage?: boolean;
}

interface CardFormModalProps {
  open: boolean;
  initial?: Card | null;
  defaultDeck: string;
  onClose: () => void;
  onSave: (values: CardFormValues) => Promise<void>;
}

function blankValues(defaultDeck: string): CardFormValues {
  return {
    quantity: 1,
    name: "",
    cardEngineId: "",
    deck: defaultDeck,
    type: "energia",
    title: "",
    description: "",
    cost: 0,
    code: "",
    imageFileName: "",
    imageFile: null,
    clearImage: false,
  };
}

export function CardFormModal({
  open,
  initial,
  defaultDeck,
  onClose,
  onSave,
}: CardFormModalProps) {
  const titleId = useId();
  const [values, setValues] = useState<CardFormValues>(blankValues(defaultDeck));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = getCardTypeMeta(values.type);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setValues({
        quantity: initial.quantity,
        name: initial.name,
        cardEngineId: initial.cardEngineId,
        deck: initial.deck,
        type: initial.type,
        title: initial.title,
        description: initial.description,
        cost: initial.cost,
        code: initial.code,
        imageFileName: initial.imageFileName,
        imageFile: null,
        clearImage: false,
      });
    } else {
      setValues(blankValues(defaultDeck));
    }
    setError(null);
  }, [open, initial, defaultDeck]);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    async function loadPreview() {
      if (values.imageFile) {
        const url = URL.createObjectURL(values.imageFile);
        revoked = url;
        setPreviewUrl(url);
        return;
      }
      if (values.clearImage || !initial?.imageBlobKey) {
        setPreviewUrl(null);
        return;
      }
      const img = await getImage(initial.imageBlobKey);
      if (cancelled) return;
      if (!img) {
        setPreviewUrl(null);
        return;
      }
      const url = URL.createObjectURL(img.blob);
      revoked = url;
      setPreviewUrl(url);
    }

    void loadPreview();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [values.imageFile, values.clearImage, initial?.imageBlobKey, open]);

  if (!open) return null;

  function update<K extends keyof CardFormValues>(key: K, value: CardFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "type") {
        const typeMeta = getCardTypeMeta(value as CardType);
        if (typeMeta.costLocked) next.cost = 0;
      }
      if (key === "title" && !prev.name) {
        next.name = String(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...values,
        cost: meta.costLocked ? 0 : values.cost,
        name: values.name.trim() || values.title.trim(),
      };
      await onSave(payload);
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
          <h2 id={titleId}>{initial ? "Editar carta" : "Nueva carta"}</h2>
          <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <form className="modal__body form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tipo</span>
            <select
              value={values.type}
              onChange={(e) => update("type", e.target.value as CardType)}
            >
              {CARD_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <small>
              Subtítulo: <strong>{meta.subtitle}</strong> · Marco{" "}
              <strong style={{ color: meta.frameColorHex }}>{meta.frameColor}</strong>
              {meta.hasIcon ? ` · Icono: ${meta.iconLabel}` : " · Sin icono inferior"}
            </small>
          </label>

          <label className="field">
            <span>Título</span>
            <input
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </label>

          <label className="field field--span2">
            <span>Descripción</span>
            <textarea
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Texto del cuadro de descripción"
            />
          </label>

          <label className="field">
            <span>Coste</span>
            <input
              type="number"
              min={0}
              step={1}
              value={values.cost}
              disabled={meta.costLocked}
              onChange={(e) => update("cost", Number(e.target.value) || 0)}
            />
            {meta.costLocked && <small>Fijo en 0 para cartas básicas.</small>}
          </label>

          <label className="field">
            <span>Código (Id en carta)</span>
            <input
              value={values.code}
              onChange={(e) => update("code", e.target.value)}
              placeholder="Id"
            />
          </label>

          <label className="field">
            <span>Nombre (jerarquía Card Engine)</span>
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Por defecto = título"
            />
          </label>

          <label className="field">
            <span>Card Engine ID</span>
            <input
              value={values.cardEngineId}
              onChange={(e) => update("cardEngineId", e.target.value)}
              placeholder="Vacío = carta nueva al importar"
            />
          </label>

          <label className="field">
            <span>Mazo</span>
            <input
              value={values.deck}
              onChange={(e) => update("deck", e.target.value)}
            />
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

          <div className="field field--span2 image-field">
            <span>Imagen (arte)</span>
            <div className="image-field__row">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa" className="image-preview" />
              ) : (
                <div className="image-preview image-preview--empty">Sin imagen</div>
              )}
              <div className="image-field__controls">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (!file) return;
                    const safe = sanitizeFileName(file.name);
                    const ext = file.name.includes(".")
                      ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
                      : ".png";
                    const withExt = safe.endsWith(ext) ? safe : `${safe}${ext}`;
                    setValues((prev) => ({
                      ...prev,
                      imageFile: file,
                      imageFileName: withExt,
                      clearImage: false,
                    }));
                  }}
                />
                {values.imageFileName && (
                  <small>Archivo: {values.imageFileName}</small>
                )}
                {(previewUrl || values.imageFileName) && (
                  <button
                    type="button"
                    className="btn btn--danger-ghost"
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        imageFile: null,
                        imageFileName: "",
                        clearImage: true,
                      }))
                    }
                  >
                    Quitar imagen
                  </button>
                )}
              </div>
            </div>
          </div>

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
