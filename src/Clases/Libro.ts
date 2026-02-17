export class Libro {
  constructor(
    public id: number,
    public titulo: string,
    public genero: string,
    public disponible: boolean
  ) {}

  marcarDisponible(valor: boolean) {
    this.disponible = valor;
  }
}
