import { Evento } from "./Evento";
import { Usuario } from "./Usuario";

export interface Inscricao {
    id? : number;
    evento : Evento | string;
    eventoId : number;
    usuario : Usuario | string;
    usuarioId : number;
}