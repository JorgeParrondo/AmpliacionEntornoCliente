"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestamo = void 0;
//Relaciona las clases socio y libro y permite Consultar el estado del prestamo del libro(devuelto o no + vencido o no)
class Prestamo {
    constructor(id, socio, libro, fechaPrestamo, fechaLimite, fechaDevolucion) {
        this.id = id;
        this.socio = socio;
        this.libro = libro;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaLimite = fechaLimite;
        this.fechaDevolucion = fechaDevolucion;
    }
}
exports.Prestamo = Prestamo;
