import { useEffect, useId, useMemo, useState } from "react";
import {
  ART_PROMPT_INTRO,
  composeArtPrompt,
} from "../data/onePiece/artPrompt";
import { ModalPortal } from "./ModalPortal";

export interface ArtPromptTarget {
  id: string;
  name: string;
  kind: "card" | "city";
  artPromptCharacters?: string;
  artPromptBackground?: string;
  /** Si no hay fondo guardado, se sugiere la propuesta de imagen. */
  imageProposal?: string;
}

interface Props {
  open: boolean;
  target: ArtPromptTarget | null;
  onClose: () => void;
  onSave: (
    target: ArtPromptTarget,
    characters: string,
    background: string,
  ) => Promise<void>;
}

export function ArtPromptModal({ open, target, onClose, onSave }: Props) {
  const titleId = useId();
  const [characters, setCharacters] = useState("");
  const [background, setBackground] = useState("");
  const [saving, setSaving] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !target) return;
    setCharacters(target.artPromptCharacters ?? "");
    setBackground(
      target.artPromptBackground?.trim()
        ? target.artPromptBackground
        : (target.imageProposal ?? ""),
    );
    setCopyState("idle");
    setError(null);
  }, [open, target]);

  const composed = useMemo(
    () => composeArtPrompt(characters, background),
    [characters, background],
  );

  if (!open || !target) return null;

  const current = target;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(composed);
      setCopyState("ok");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("err");
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave(current, characters.trim(), background.trim());
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
            <h2 id={titleId}>Art prompt — {current.name}</h2>
            <button
              type="button"
              className="btn btn--icon"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>
          </header>

          <div className="modal__body form-grid">
            <div className="field field--span2">
              <span>1. Introducción (fija)</span>
              <p className="prompt-intro">{ART_PROMPT_INTRO}</p>
            </div>

            <label className="field field--span2">
              <span>2. Personaje / personajes</span>
              <textarea
                rows={3}
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                placeholder="Ej. Monkey D. Luffy, Nami y la tripulación…"
              />
            </label>

            <label className="field field--span2">
              <span>3. Fondo</span>
              <textarea
                rows={4}
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Escena, lugar, atmósfera…"
              />
            </label>

            <div className="field field--span2">
              <span>Prompt completo</span>
              <pre className="prompt-preview">{composed}</pre>
            </div>

            {error && <p className="form-error field--span2">{error}</p>}

            <div className="modal__footer field--span2">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn" onClick={() => void handleCopy()}>
                {copyState === "ok"
                  ? "¡Copiado!"
                  : copyState === "err"
                    ? "Error al copiar"
                    : "Copiar prompt"}
              </button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
