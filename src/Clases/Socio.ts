export class Socio {
  constructor(
    public id: number,
    public nombre: string,
    public email: string,
    public telefono: string
  ) {}

  actualizarDatos(nombre: string, email: string) {
    this.nombre = nombre;
    this.email = email;
  }
}
