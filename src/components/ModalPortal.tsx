import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Renderiza hijos en document.body para que position:fixed no herede transforms/filters. */
export function ModalPortal({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
