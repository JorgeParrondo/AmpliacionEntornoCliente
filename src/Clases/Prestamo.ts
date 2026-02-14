import {Socio} from "./Socio";
import {Libro} from "./Libro";

//Relaciona las clases socio y libro y permite Consultar el estado del prestamo del libro(devuelto o no + vencido o no)
export class Prestamo {

    constructor(
        public id:number,
        public socio:Socio,
        public libro:Libro,
        public fechaPrestamo:Date,
        public fechaLimite:Date,
        public fechaDevolucion:Date | null
    ){}

}
