import type { AkCardType } from "../data/astroKnights";
import type { OpCardType } from "../data/onePiece";

/** Familia visual del marco (colores del juego físico). */
export type CardPreviewFamily = "combustible" | "arma" | "tecnologia";

export interface CardPreviewData {
  name: string;
  typeLabel: string;
  family: CardPreviewFamily;
  description: string;
  /** Coste a mostrar; siempre número (0 si la carta no tiene coste). */
  cost: number;
  id?: string;
}

const TYPE_LABEL_AK: Record<AkCardType, string> = {
  combustible: "Combustible",
  arma: "Arma",
  tecnologia: "Tecnología",
};

const TYPE_LABEL_OP: Record<OpCardType, string> = {
  voluntad: "Voluntad",
  tecnica: "Técnica",
  tesoro: "Tesoro",
};

export function familyFromAkType(type: AkCardType): CardPreviewFamily {
  return type;
}

export function familyFromOpType(type: OpCardType): CardPreviewFamily {
  if (type === "voluntad") return "combustible";
  if (type === "tecnica") return "arma";
  return "tecnologia";
}

/** Sin coste en datos → se muestra como 0 (cartas básicas). */
function displayCost(cost: number | null): number {
  return cost ?? 0;
}

export function previewFromAk(card: {
  id: string;
  name: string;
  type: AkCardType;
  description: string;
  cost: number | null;
}): CardPreviewData {
  return {
    name: card.name,
    typeLabel: TYPE_LABEL_AK[card.type],
    family: familyFromAkType(card.type),
    description: card.description,
    cost: displayCost(card.cost),
    id: card.id,
  };
}

export function previewFromOp(card: {
  id: string;
  name: string;
  type: OpCardType;
  description: string;
  cost: number | null;
}): CardPreviewData {
  return {
    name: card.name,
    typeLabel: TYPE_LABEL_OP[card.type],
    family: familyFromOpType(card.type),
    description: card.description,
    cost: displayCost(card.cost),
    id: card.id,
  };
}

interface Props {
  card: CardPreviewData;
  className?: string;
}

/** Preview compacta estilo Astro Knights (sin arte): título, tipo, coste y caja de efecto. */
export function CardPreview({ card, className }: Props) {
  const rootClass = ["card-preview", `card-preview--${card.family}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="img" aria-label={`${card.name}, ${card.typeLabel}`}>
      <div className="card-preview__header">
        <h3 className="card-preview__title">{card.name}</h3>
        <p className="card-preview__type">{card.typeLabel}</p>
      </div>

      <div className="card-preview__body">
        <span className="card-preview__cost" aria-label={`Coste ${card.cost}`}>
          {card.cost}
        </span>
        <div className="card-preview__effect">
          <p>{card.description}</p>
        </div>
      </div>

      {card.id && <span className="card-preview__id">{card.id}</span>}
    </div>
  );
}
