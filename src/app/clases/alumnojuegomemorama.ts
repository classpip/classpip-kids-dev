    export class alumnojuegomemorama {

        alumnoId: any;
        juegoDeMemoramaId: any;
        id: any;
        puntuacion:any;
        tiempo:any;
        constructor(alumnoId?: any, juegoDeMemoramaId?: any, puntuacion?:any, tiempo?:any, id?:any) {
      
          this.alumnoId = alumnoId;
          this.juegoDeMemoramaId = juegoDeMemoramaId;
          this.puntuacion= puntuacion;
          this.tiempo=tiempo;
          this.id=id;
      
        }
      }