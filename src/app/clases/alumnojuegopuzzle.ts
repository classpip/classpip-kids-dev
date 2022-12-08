export class alumnojuegopuzzle {

  alumnoId: number;
  juegoDePuzzleId: number;
  id: number;
  puntuacion: number;
  tiempo: any;

  constructor(alumnoId?: number, juegoDePuzzleId?: number, puntuacion?: number, tiempo?: any) {

    this.alumnoId = alumnoId;
    this.juegoDePuzzleId = juegoDePuzzleId;
    this.puntuacion = puntuacion;
    this.tiempo = tiempo;

  }
}