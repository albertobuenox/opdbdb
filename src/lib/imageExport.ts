import JSZip from "jszip";
import type { Card } from "../types";
import { getImage } from "../db/indexedDb";
import { downloadTextFile } from "./csvExport";

export function sanitizeFileName(name: string): string {
  const base = name.trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return base || `imagen_${Date.now()}`;
}

export async function exportImagesZip(
  cards: Card[],
  categoryFolder = "Custom",
): Promise<{ count: number; skipped: string[] }> {
  const zip = new JSZip();
  const folder = zip.folder(categoryFolder);
  if (!folder) throw new Error("No se pudo crear la carpeta del ZIP");

  const usedNames = new Set<string>();
  const skipped: string[] = [];
  let count = 0;

  for (const card of cards) {
    if (!card.imageBlobKey || !card.imageFileName) {
      skipped.push(card.title || card.name || card.id);
      continue;
    }
    const stored = await getImage(card.imageBlobKey);
    if (!stored) {
      skipped.push(card.title || card.name || card.id);
      continue;
    }

    let fileName = card.imageFileName;
    if (usedNames.has(fileName)) {
      const stem = fileName.replace(/\.[^.]+$/, "");
      const ext = fileName.includes(".")
        ? fileName.slice(fileName.lastIndexOf("."))
        : "";
      fileName = `${stem}_${card.id.slice(0, 8)}${ext}`;
    }
    usedNames.add(fileName);
    folder.file(fileName, stored.blob);
    count += 1;
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CustomAssets.zip";
  a.click();
  URL.revokeObjectURL(url);

  return { count, skipped };
}

export async function exportCsvAndImages(
  csv: string,
  cards: Card[],
  categoryFolder: string,
): Promise<{ imageCount: number; skipped: string[] }> {
  downloadTextFile("CardData.csv", csv);
  const result = await exportImagesZip(cards, categoryFolder);
  return { imageCount: result.count, skipped: result.skipped };
}
