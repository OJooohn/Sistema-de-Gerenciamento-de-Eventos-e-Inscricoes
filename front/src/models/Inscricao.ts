import { Evento } from "./Evento";
import { Usuario } from "./Usuario";

export interface Inscricao {
    id? : number;
    eventoId : number;
    evento? : Evento;
    usuarioId : number;
}