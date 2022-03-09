export class Libro{

         
    autor: any;
    resumen: any;
    portada: any;
    titulo:any;
    numeropag: any;
    idAlumno: any;
    puntuacion: any;
    finalizado: any;
    id: any;
    mediaPuntuacion: any;
    listavotantes: any;
    criterio1: any;
    criterio2: any;
    criterio3: any;
    criteriototal: any;
    listavotantesconcurso: any;
    alumnoJuegoCuentoId: any;
    foto: any;

    constructor( 
        autor = '',
        resumen = '',
        titulo = '',
        portada = '',
        numeropag = '',
        idAlumno = '',
        finalizado ='',
        criterio1 = 0,
        criterio2 = 0,
        criterio3 = 0,
        criteriototal = 0

    ) {
        this.autor = autor,
        this.titulo = titulo,
        this.resumen = resumen,
        this.portada = portada,
        this.numeropag = numeropag,
        this.idAlumno = idAlumno,
        this.finalizado = finalizado,
        this.criterio1 = criterio1,
        this.criterio2 = criterio2,
        this.criterio3 = criterio3,
        this.criteriototal = criteriototal


    }
}