"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libro = void 0;
//Clase libro con su constructor
class Libro {
    constructor(id, titulo, autor, genero, disponible) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.disponible = disponible;
    }
}
exports.Libro = Libro;
