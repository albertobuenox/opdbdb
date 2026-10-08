import { useEffect, useState, type FormEvent } from "react";
import { ModalPortal } from "./ModalPortal";
import type { AppSettings, CardType } from "../types";
import { CARD_TYPES, ICON_CARD_TYPES } from "../data/cardTypes";

interface SettingsPanelProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSave: (settings: AppSettings) => Promise<void>;
}

export function SettingsPanel({
  open,
  settings,
  onClose,
  onSave,
}: SettingsPanelProps) {
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  if (!open) return null;

  function setTemplate(type: CardType, value: string) {
    setDraft((prev) => ({
      ...prev,
      templateIds: { ...prev.templateIds, [type]: value.trim() },
    }));
  }

  function setIcon(type: CardType, value: string) {
    setDraft((prev) => ({
      ...prev,
      iconAssetIds: { ...prev.iconAssetIds, [type]: value.trim() },
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
      onClose();
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
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="settings-title">Ajustes Card Engine</h2>
          <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <form className="modal__body" onSubmit={handleSave}>
          <div className="form-grid">
            <label className="field">
              <span>Categoría de imágenes</span>
              <input
                value={draft.imageCategory}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, imageCategory: e.target.value.trim() || "Custom" }))
                }
              />
              <small>
                En el CSV, Arte = <code>{draft.imageCategory || "Custom"}_nombrearchivo</code>
              </small>
            </label>
            <label className="field">
              <span>Mazo por defecto</span>
              <input
                value={draft.defaultDeck}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, defaultDeck: e.target.value }))
                }
              />
            </label>
          </div>

          <h3 className="settings-subtitle">TemplateID por tipo</h3>
          <p className="settings-hint">
            Abre cada plantilla en Card Engine, haz clic en el ID de la barra superior y pégalo aquí.
          </p>
          <div className="settings-grid">
            {CARD_TYPES.map((t) => (
              <label key={t.id} className="field">
                <span>
                  {t.label}
                  <em style={{ color: t.frameColorHex }}> · {t.frameColor}</em>
                </span>
                <input
                  value={draft.templateIds[t.id] ?? ""}
                  onChange={(e) => setTemplate(t.id, e.target.value)}
                  placeholder="ID de plantilla"
                />
              </label>
            ))}
          </div>

          <h3 className="settings-subtitle">Iconos (asset id)</h3>
          <p className="settings-hint">
            Formato Card Engine: <code>categoria_archivo</code> (ej. <code>Icons_P_p_icons_68</code>).
            Solo tipos con icono inferior.
          </p>
          <div className="settings-grid">
            {CARD_TYPES.filter((t) => ICON_CARD_TYPES.includes(t.id)).map((t) => (
              <label key={t.id} className="field">
                <span>{t.iconLabel ?? t.label}</span>
                <input
                  value={draft.iconAssetIds[t.id] ?? ""}
                  onChange={(e) => setIcon(t.id, e.target.value)}
                  placeholder="Icons_P_..."
                />
              </label>
            ))}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar ajustes"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
