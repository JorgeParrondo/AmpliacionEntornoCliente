import { Socio } from "./Socio";
import { Libro } from "./Libro";
import { EstadoPrestamo } from "../Tipos/EstadoPrestamo";

export class Prestamo {
  constructor(
    public id: number,
    public socio: Socio,
    public libro: Libro,
    public fechaPrestamo: Date,
    public fechaLimite: Date,
    public fechaDevolucion: Date | null
  ) {}

  obtenerEstado(): EstadoPrestamo {

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
