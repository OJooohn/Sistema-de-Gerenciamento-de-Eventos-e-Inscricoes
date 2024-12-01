import { Usuario } from "./Usuario";

export interface Evento {
    id? : number;
    nome : string;
    descricao : string;
    dataEvento : string;

    proprietarioId : number;
    proprietario? : Usuario;

    vagasRestantes? : number;
    vagasMaximo : number;
}