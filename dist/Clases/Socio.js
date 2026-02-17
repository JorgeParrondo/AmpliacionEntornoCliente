"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socio = void 0;
class Socio {
    constructor(id, nombre, email, telefono) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
    actualizarDatos(nombre, email) {
        this.nombre = nombre;
        this.email = email;
    }
}
exports.Socio = Socio;
