//Relaciona las clases socio y libro y permite Consultar el estado del prestamo del libro(devuelto o no + vencido o no)
export class Prestamo {
    constructor(id, socio, libro, fechaPrestamo, fechaLimite, fechaDevolucion) {
        this.id = id;
        this.socio = socio;
        this.libro = libro;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaLimite = fechaLimite;
        this.fechaDevolucion = fechaDevolucion;
    }
}
//# sourceMappingURL=Prestamo.js.map