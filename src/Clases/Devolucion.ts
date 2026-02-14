import {Prestamo} from "./Prestamo";
//Para consultar las devoluciones
export class Devolucion {

    constructor(
        public id:number,
        public prestamo:Prestamo,
        public fecha:Date
    ){}

}
