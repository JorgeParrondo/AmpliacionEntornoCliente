"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestamo = void 0;
class Prestamo {
    constructor(id, socio, libro, fechaPrestamo, fechaLimite, fechaDevolucion) {
        this.id = id;
        this.socio = socio;
        this.libro = libro;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaLimite = fechaLimite;
        this.fechaDevolucion = fechaDevolucion;
    }
    obtenerEstado() {
        if (this.fechaDevolucion) {
            return "DEVUELTO";
        }
        const hoy = new Date();
        if (hoy > this.fechaLimite) {
            return "VENCIDO";
        }
        return "NO_VENCIDO";
    }
}
exports.Prestamo = Prestamo;
