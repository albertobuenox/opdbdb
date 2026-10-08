import { getCardTypeMeta } from "../data/cardTypes";
import type { AppSettings, Card } from "../types";

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const withBreaks = normalized.replace(/\n/g, "\\n");
  if (/[",]/.test(withBreaks)) {
    return `"${withBreaks.replace(/"/g, '""')}"`;
  }
  return withBreaks;
}

export function imageStem(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

export function artAssetId(
  category: string,
  fileName: string,
): string {
  if (!fileName) return "";
  const stem = imageStem(fileName);
  return `${category}_${stem}`;
}

export function buildCsvRows(
  cards: Card[],
  settings: AppSettings,
): { csv: string; warnings: string[] } {
  const headers = [
    "Quantity",
    "Name",
    "CardID",
    "TemplateID",
    "Deck",
    "Titulo",
    "Tipo",
    "Descripcion",
    "Coste",
    "Codigo",
    "Icono",
    "Arte",
  ];

  const warnings: string[] = [];
  const lines = [headers.join(",")];

  for (const card of cards) {
    const meta = getCardTypeMeta(card.type);
    const templateId = settings.templateIds[card.type] ?? "";
    if (!templateId) {
      warnings.push(
        `"${card.title || card.name}" (${meta.label}): falta TemplateID en Ajustes.`,
      );
    }

    const icon = meta.hasIcon
      ? (settings.iconAssetIds[card.type] ?? "")
      : "";
    if (meta.hasIcon && !icon) {
      warnings.push(
        `"${card.title || card.name}" (${meta.label}): falta Icono (asset id) en Ajustes.`,
      );
    }

    const arte = artAssetId(settings.imageCategory, card.imageFileName);
    if (!arte) {
      warnings.push(
        `"${card.title || card.name}": sin imagen asignada (columna Arte vacía).`,
      );
    }

    const cost = meta.costLocked ? 0 : card.cost;
    const row = [
      String(card.quantity || 1),
      escapeCsvCell(card.name || card.title),
      escapeCsvCell(card.cardEngineId),
      escapeCsvCell(templateId),
      escapeCsvCell(card.deck || settings.defaultDeck),
      escapeCsvCell(card.title),
      escapeCsvCell(meta.subtitle),
      escapeCsvCell(card.description),
      escapeCsvCell(String(cost)),
      escapeCsvCell(card.code),
      escapeCsvCell(icon),
      escapeCsvCell(arte),
    ];
    lines.push(row.join(","));
  }

  return { csv: lines.join("\n") + "\n", warnings };
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
