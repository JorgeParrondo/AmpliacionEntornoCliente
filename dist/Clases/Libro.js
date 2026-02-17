"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libro = void 0;
class Libro {
    constructor(id, titulo, genero, disponible) {
        this.id = id;
        this.titulo = titulo;
        this.genero = genero;
        this.disponible = disponible;
    }
    marcarDisponible(valor) {
        this.disponible = valor;
    }
}
exports.Libro = Libro;
