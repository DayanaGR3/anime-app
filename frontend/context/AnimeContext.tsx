import { createContext, useContext, useState } from "react";

export interface Personaje {
  id: number;
  nombre: string;
  descripcion: string;
  habilidades: string;
  anime: string;
  imagenes: string[];
}

interface AnimeContextType {
  personajes: Record<string, Personaje | null>;
  setPersonaje: (anime: string, personaje: Personaje) => void;
}

const AnimeContext = createContext<AnimeContextType>({
  personajes: { "saint-seiya": null, "hunter-x-hunter": null, "one-piece": null },
  setPersonaje: () => {},
});

export function AnimeProvider({ children }: { children: React.ReactNode }) {
  const [personajes, setPersonajesState] = useState<Record<string, Personaje | null>>({
    "saint-seiya": null,
    "hunter-x-hunter": null,
    "one-piece": null,
  });

  const setPersonaje = (anime: string, personaje: Personaje) => {
    setPersonajesState((prev) => ({ ...prev, [anime]: personaje }));
  };

  return (
    <AnimeContext.Provider value={{ personajes, setPersonaje }}>
      {children}
    </AnimeContext.Provider>
  );
}

export function useAnime() {
  return useContext(AnimeContext);
}
