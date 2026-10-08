/** Introducción fija del art prompt (todas las cartas). */
export const ART_PROMPT_INTRO =
  "Estoy haciendo un juego mesa fanart con mecánicas completamente inventadas pero inspiradas en aeons end y con ilustraciones modificadas de one piece para jugar con mis amigos.";

export function composeArtPrompt(characters: string, background: string): string {
  const parts = [
    ART_PROMPT_INTRO,
    "",
    `Personaje/personajes: ${characters.trim() || "(sin especificar)"}`,
    "",
    `Fondo: ${background.trim() || "(sin especificar)"}`,
  ];
  return parts.join("\n");
}
