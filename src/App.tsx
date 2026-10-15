import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppSettings } from "./types";
import type { AstroKnightsCard, AstroKnightsCity } from "./data/astroKnights";
import type { OnePieceCard, OnePieceCity } from "./data/onePiece";
import type { HeroCard } from "./data/heroes";
import {
  defaultSettings,
  getAllAkCards,
  getAllAkCities,
  getAllOpCards,
  getAllOpCities,
  getAllHeroes,
  getSettings,
  deleteAkCard,
  deleteAkCity,
  deleteOpCard,
  deleteOpCity,
  putAkCard,
  putAkCity,
  putOpCard,
  putOpCity,
  reseedAstroKnights,
  reseedOnePiece,
  saveAkCard,
  saveAkCity,
  saveOpCard,
  saveOpCity,
  saveHero,
  deleteHero,
  saveSettings,
} from "./db/indexedDb";
import { SettingsPanel } from "./components/SettingsPanel";
import { AkReferencePanel } from "./components/AkReferencePanel";
import { OpReferencePanel } from "./components/OpReferencePanel";
import { EquivalenceValidationPanel } from "./components/EquivalenceValidationPanel";
import { HeroesPanel } from "./components/HeroesPanel";
import "./styles/app.css";

type View = "onepiece" | "astro" | "equivalencias" | "heroes";

export default function App() {
  const [view, setView] = useState<View>("equivalencias");
  const [akCards, setAkCards] = useState<AstroKnightsCard[]>([]);
  const [akCities, setAkCities] = useState<AstroKnightsCity[]>([]);
  const [opCards, setOpCards] = useState<OnePieceCard[]>([]);
  const [opCities, setOpCities] = useState<OnePieceCity[]>([]);
  const [heroes, setHeroes] = useState<HeroCard[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings());
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [s, akC, akCity, opC, opCity, heroRows] = await Promise.all([
      getSettings(),
      getAllAkCards(),
      getAllAkCities(),
      getAllOpCards(),
      getAllOpCities(),
      getAllHeroes(),
    ]);
    setSettings(s);
    setAkCards(akC);
    setAkCities(akCity);
    setOpCards(opC);
    setOpCities(opCity);
    setHeroes(heroRows);
  }, []);

  useEffect(() => {
    void (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const akCardNames = useMemo(
    () => Object.fromEntries(akCards.map((c) => [c.id, c.name])),
    [akCards],
  );
  const akCityNames = useMemo(
    () => Object.fromEntries(akCities.map((c) => [c.id, c.name])),
    [akCities],
  );

  return (
    <div className="app">
      <div className="bg-glow" aria-hidden />
      <header className="hero">
        <div className="hero__brand">
          <p className="hero__eyebrow">Herramienta local</p>
          <h1>One Piece Deck Building</h1>
          <p className="hero__tagline">
            Proxies One Piece enlazados 1:1 a la base Astro Knights. Voluntad
            (☀), técnicas y ciudades.
          </p>
        </div>
        <div className="hero__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setSettingsOpen(true)}
          >
            Ajustes
          </button>
        </div>
      </header>

      <nav className="view-nav" aria-label="Secciones">
        <button
          type="button"
          className={
            view === "equivalencias"
              ? "view-nav__btn view-nav__btn--active"
              : "view-nav__btn"
          }
          onClick={() => setView("equivalencias")}
        >
          Validar equivalencias
        </button>
        <button
          type="button"
          className={
            view === "onepiece" ? "view-nav__btn view-nav__btn--active" : "view-nav__btn"
          }
          onClick={() => setView("onepiece")}
        >
          Base One Piece
        </button>
        <button
          type="button"
          className={
            view === "heroes" ? "view-nav__btn view-nav__btn--active" : "view-nav__btn"
          }
          onClick={() => setView("heroes")}
        >
          Héroes
        </button>
        <button
          type="button"
          className={view === "astro" ? "view-nav__btn view-nav__btn--active" : "view-nav__btn"}
          onClick={() => setView("astro")}
        >
          Base Astro Knights
        </button>
      </nav>

      <main>
        {loading ? (
          <p className="loading">Cargando…</p>
        ) : view === "astro" ? (
          <AkReferencePanel
            cards={akCards}
            cities={akCities}
            onToggleCardReview={async (card) => {
              await putAkCard({ ...card, needsReview: !card.needsReview });
              await refresh();
            }}
            onToggleCityReview={async (city) => {
              await putAkCity({ ...city, needsReview: !city.needsReview });
              await refresh();
            }}
            onSaveCard={async (card, previousId) => {
              await saveAkCard(card, previousId);
              await refresh();
              setToast("Carta AK guardada.");
            }}
            onSaveCity={async (city, previousId) => {
              await saveAkCity(city, previousId);
              await refresh();
              setToast("Ciudad AK guardada.");
            }}
            onDeleteCard={(card) => {
              void (async () => {
                const ok = window.confirm(
                  `¿Borrar la carta «${card.name}» (${card.id}) de la base Astro Knights?`,
                );
                if (!ok) return;
                await deleteAkCard(card.id);
                await refresh();
                setToast("Carta AK borrada.");
              })();
            }}
            onDeleteCity={(city) => {
              void (async () => {
                const ok = window.confirm(
                  `¿Borrar la ciudad «${city.name}» (${city.id})?`,
                );
                if (!ok) return;
                await deleteAkCity(city.id);
                await refresh();
                setToast("Ciudad AK borrada.");
              })();
            }}
            onReseed={() => {
              void (async () => {
                const ok = window.confirm(
                  "Esto sobrescribe la base Astro Knights con el seed. ¿Continuar?",
                );
                if (!ok) return;
                await reseedAstroKnights();
                await refresh();
                setToast("Base Astro Knights re-sembrada.");
              })();
            }}
          />
        ) : view === "heroes" ? (
          <HeroesPanel
            heroes={heroes}
            onSave={async (hero, previousId) => {
              await saveHero(hero, previousId);
              await refresh();
              setToast("Héroe guardado.");
            }}
            onDelete={async (hero) => {
              await deleteHero(hero.id);
              await refresh();
              setToast("Héroe borrado.");
            }}
          />
        ) : view === "equivalencias" ? (
          <EquivalenceValidationPanel
            opCards={opCards}
            opCities={opCities}
            akCards={akCards}
            akCities={akCities}
            onSaveCard={async (card, previousId) => {
              await saveOpCard(card, previousId);
              await refresh();
              setToast("Equivalencia guardada.");
            }}
            onSaveCity={async (city, previousId) => {
              await saveOpCity(city, previousId);
              await refresh();
              setToast("Equivalencia de ciudad guardada.");
            }}
            onToggleCardValidated={(card) => {
              void (async () => {
                await putOpCard({
                  ...card,
                  equivalenceValidated: !card.equivalenceValidated,
                });
                await refresh();
              })();
            }}
            onToggleCityValidated={(city) => {
              void (async () => {
                await putOpCity({
                  ...city,
                  equivalenceValidated: !city.equivalenceValidated,
                });
                await refresh();
              })();
            }}
          />
        ) : (
          <OpReferencePanel
            cards={opCards}
            cities={opCities}
            akCardNames={akCardNames}
            akCityNames={akCityNames}
            onSaveCard={async (card, previousId) => {
              await saveOpCard(card, previousId);
              await refresh();
              setToast("Carta OP guardada.");
            }}
            onSaveCity={async (city, previousId) => {
              await saveOpCity(city, previousId);
              await refresh();
              setToast("Ciudad OP guardada.");
            }}
            onDeleteCard={(card) => {
              void (async () => {
                const ok = window.confirm(
                  `¿Borrar «${card.name}» (${card.id})?`,
                );
                if (!ok) return;
                await deleteOpCard(card.id);
                await refresh();
                setToast("Carta OP borrada.");
              })();
            }}
            onDeleteCity={(city) => {
              void (async () => {
                const ok = window.confirm(
                  `¿Borrar «${city.name}» (${city.id})?`,
                );
                if (!ok) return;
                await deleteOpCity(city.id);
                await refresh();
                setToast("Ciudad OP borrada.");
              })();
            }}
            onReseed={() => {
              void (async () => {
                const ok = window.confirm(
                  "Esto sobrescribe la base One Piece con el seed. ¿Continuar?",
                );
                if (!ok) return;
                await reseedOnePiece();
                await refresh();
                setToast("Base One Piece re-sembrada.");
              })();
            }}
          />
        )}
      </main>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={async (next) => {
          await saveSettings(next);
          setSettings(next);
          setToast("Ajustes guardados.");
        }}
      />

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
