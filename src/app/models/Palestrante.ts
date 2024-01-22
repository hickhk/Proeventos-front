/* eslint-disable prettier/prettier */
import { PalestranteEvento } from "./PalestranteEvento";
import { RedeSocial } from "./RedeSocial";
import { User } from "./account/User";
import { UserUpdate } from "./account/UserUpdate";

export interface Palestrante {
  id: number;
  userId: number | undefined;
  miniCurriculo: string;
  user: UserUpdate;
  redesSociais: RedeSocial[];
  palestrantesEventos: PalestranteEvento[];
}
