import type { CardType } from "../types";
import { getCardTypeMeta } from "../data/cardTypes";

interface TypeBadgeProps {
  type: CardType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const meta = getCardTypeMeta(type);
  return (
    <span
      className="type-badge"
      style={{
        ["--badge-color" as string]: meta.frameColorHex,
      }}
      title={`${meta.label} · marco ${meta.frameColor}`}
    >
      {meta.subtitle}
      {meta.hasIcon && meta.iconLabel && meta.iconLabel !== meta.subtitle
        ? ` · ${meta.iconLabel}`
        : ""}
    </span>
  );
}
