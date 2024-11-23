import { Proprietario } from "./Proprietario";

export interface Evento {
    id? : number;
    nome : string;
    descricao : string;
    dataEvento : string;
    vagasMaximo : number;
    vagasRestantes? : number;
    proprietario? : Proprietario | string;
    proprietarioId : number;
}