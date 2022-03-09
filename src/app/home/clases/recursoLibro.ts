export class RecursoLibro {
    
    nombre: any
    carpeta: any;
    imagenes: any;
    profesorId: any;
    id: any;
    constructor(carpeta?: any, nombre?: any, imagenes?:any, profesorId?:any, id?:any) {
  
      this.nombre = nombre;
      this.carpeta = carpeta;
      this.imagenes = imagenes;
      this.profesorId = profesorId;
      this.id = id;


    }
  }