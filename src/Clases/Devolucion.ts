import { Prestamo } from "./Prestamo";

export class Devolucion {
  constructor(
    public id: number,
    public prestamo: Prestamo,
    public fecha: Date
  ) {}
}
