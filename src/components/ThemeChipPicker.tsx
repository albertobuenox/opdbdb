import type { CSSProperties } from "react";
import {
  OP_THEME_CHIPS,
  toggleThemeChip,
  type OpThemeChipId,
} from "../data/onePiece";

interface Props {
  value: OpThemeChipId[];
  onChange: (next: OpThemeChipId[]) => void;
  /** Solo lectura: chips seleccionados, sin toggle. */
  readOnly?: boolean;
  compact?: boolean;
}

function chipStyle(colorA: string, colorB: string): CSSProperties {
  return {
    ["--chip-a" as string]: colorA,
    ["--chip-b" as string]: colorB,
  };
}

export function ThemeChipPicker({
  value,
  onChange,
  readOnly = false,
  compact = false,
}: Props) {
  const selected = new Set(value);

  if (readOnly) {
    const chips = OP_THEME_CHIPS.filter((c) => selected.has(c.id));
    if (chips.length === 0) {
      return <span className="muted tiny">Sin chips</span>;
    }
    return (
      <div className={compact ? "theme-chips theme-chips--compact" : "theme-chips"}>
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="theme-chip theme-chip--on"
            style={chipStyle(chip.colorA, chip.colorB)}
            title={`${chip.label} · ${chip.hint}`}
          >
            <span className="theme-chip__swatch" aria-hidden />
            {chip.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={compact ? "theme-chips theme-chips--compact" : "theme-chips"}
      role="group"
      aria-label="Sugerencias temáticas"
    >
      {OP_THEME_CHIPS.map((chip) => {
        const on = selected.has(chip.id);
        return (
          <button
            key={chip.id}
            type="button"
            className={on ? "theme-chip theme-chip--on" : "theme-chip"}
            style={chipStyle(chip.colorA, chip.colorB)}
            title={`${chip.label} · ${chip.hint}`}
            aria-pressed={on}
            onClick={() => onChange(toggleThemeChip(value, chip.id))}
          >
            <span className="theme-chip__swatch" aria-hidden />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
