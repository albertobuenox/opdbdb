import { useEffect, useState } from "react";

interface Props {
  value: string;
  onSave: (next: string) => Promise<void>;
}

/** Descripción de arte: click para editar, Guardar / Cancelar. */
export function EditableArtProposal({ value, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setDraft(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="eq-art eq-art--btn"
        onClick={() => setEditing(true)}
        title="Clic para editar la propuesta de arte"
      >
        <span className="eq-art__label">Arte del proxy</span>
        <span className="eq-art__text">
          {value.trim() || "Sin propuesta de arte — clic para escribir…"}
        </span>
      </button>
    );
  }

  return (
    <div className="eq-art eq-art--editing">
      <span className="eq-art__label">Arte del proxy</span>
      <textarea
        className="eq-art__textarea"
        rows={4}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
      />
      <div className="eq-art__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
