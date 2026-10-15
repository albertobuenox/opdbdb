import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CardPreview, type CardPreviewData } from "./CardPreview";

export type { CardPreviewData };

interface Props {
  card: CardPreviewData | null;
  children: ReactNode;
  className?: string;
}

const PREVIEW_W = 280;
const GAP = 12;

/**
 * Muestra `CardPreview` al hacer hover/focus sobre el hijo.
 * Posiciona el popup cerca del trigger sin quedar cortado por overflow.
 */
export function CardPreviewHover({ card, children, className }: Props) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const panelId = useId();

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const preferredLeft = rect.right + GAP;
    const left =
      preferredLeft + PREVIEW_W > window.innerWidth - 8
        ? Math.max(8, rect.left - PREVIEW_W - GAP)
        : preferredLeft;
    const top = Math.min(
      Math.max(8, rect.top),
      window.innerHeight - 220,
    );
    setCoords({ top, left });
  }, []);

  const show = useCallback(() => {
    if (!card) return;
    updatePosition();
    setOpen(true);
  }, [card, updatePosition]);

  const hide = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, updatePosition]);

  if (!card) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={["card-preview-hover", className].filter(Boolean).join(" ")}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={open ? panelId : undefined}
      >
        {children}
      </div>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={panelId}
            className="card-preview-popup"
            style={{ top: coords.top, left: coords.left }}
            role="tooltip"
          >
            <CardPreview card={card} />
          </div>,
          document.body,
        )}
    </>
  );
}
