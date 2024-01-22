/* eslint-disable prettier/prettier */
import { Palestrante } from "./Palestrante";

export interface PalestranteEvento {
  palestranteId: number;
  eventoId: number;
  palestrantes: Palestrante[];
  evento: Event;
}
