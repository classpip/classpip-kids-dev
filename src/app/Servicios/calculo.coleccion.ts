import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
// tslint:disable-next-line:max-line-length

import { Observable, observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from 'querystring';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { DbServiceService } from './peticionesAPI';
import { element } from 'protractor';
import { Album } from '../clases/Album';
import { AlbumEquipo } from '../clases/Albumequipo';
import { TablaAlumnoJuegoDePuntos } from '../clases/TablaAlumnoJuegoDePuntos';
import { TablaEquipoJuegoDePuntos } from '../clases/TablaEquipoJuegoDePuntos';
import { TablaHistorialPuntosEquipo } from '../clases/clasesParaTablasJuegoDePuntos/TablaHistorialPuntosEquipo';
import { TablaHistorialPuntosAlumno } from '../clases/clasesParaTablasJuegoDePuntos/TablaHistorialPuntosAlumno';

@Injectable({
  providedIn: 'root'
})

export class CalculosService {


  puntos: number;
  MiImagenCromo: string;
  juegosdePuntos: any[] = [];

  constructor(
    public https: Http,
    private dbService: DbServiceService

  ) {
  }

//  JuegoPuntosAlumno(alumnoID:any): any {
  
//   this.dbService.DameJuegoDePuntosAlumno(alumnoID)
//   .subscribe(JuegoPuntos =>{
   
//     console.log("JuegoPuntos:",JuegoPuntos);
//     return JuegoPuntos;

//                           })

// }

// Esta función recibe una lista de cromos en la que puede haber repetidos
  // y geneera otra en la que cada cromo aparece una sola vez y se le asocia el número
  // de veces que aparece reperido en la lista de entrada
  GeneraListaSinRepetidos(listaCromos: any[]): any[] {
    const listaCromosSinRepetidos: any[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaCromos.length; i++) {
      const n = listaCromos.filter(cromo => cromo.Nombre === listaCromos[i].Nombre).length;
      if (listaCromosSinRepetidos.filter(res => res.cromo.Nombre === listaCromos[i].Nombre).length === 0) {
        listaCromosSinRepetidos.push({ rep: n, cromo: listaCromos[i] });
      }
    }
    return listaCromosSinRepetidos;
  }

  DameCromosQueNoTengo(MisCromos: any[], TodosLosCromos: any[]): any[] {
    const CromosQueNoTengo: any[] = [];
    // tslint:disable-next-line:no-shadowed-variable
    let Cromo: any;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < TodosLosCromos.length; i++) {
      Cromo = MisCromos.filter(res => res.id === TodosLosCromos[i].id)[0];
      if (Cromo === undefined) {
        CromosQueNoTengo.push({ rep: 0, cromo: TodosLosCromos[i] });
      }
    }
    return CromosQueNoTengo;
  }

  public RegalaCromoAlumnos(cromo: any, alumnoDestinatarioId: number, alumnoQueRegalaId: number, juegoSeleccionado: any) {
    

    // No entiendo muy bien por qué esta petición devuelve un vector de inscripciones y no una sola.
    // por eso indexo la inscripcion con [0]
    // Lo mismo pasa al pedir los cromos del alumno (DameAlbumAlumno)
    this.dbService.DameInscripcionAlumnoJuegoDeColeccion(juegoSeleccionado.id, alumnoDestinatarioId)
    .subscribe( inscripcion => 
                                this.dbService.AsignarCromoAlumno(new Album(inscripcion[0].id, cromo.id))
                                .subscribe()
             );
     this.dbService.DameInscripcionAlumnoJuegoDeColeccion(juegoSeleccionado.id, alumnoQueRegalaId)
    .subscribe( inscripcion => 
                                this.dbService.DameAlbumAlumno(cromo.id, inscripcion[0].id)
                                .subscribe( album => 
                                                    this.dbService.BorrarAlbumAlumno(album[0].id).subscribe()));
  }

  public RegalaCromoEquipos(cromo: any, equipoDestinatarioId: number, equipoQueRegalaId: number, juegoSeleccionado: any) {

    // No entiendo muy bien por qué esta petición devuelve un vector de inscripciones y no una sola.
    // por eso indexo la inscripcion con [0]
    // Lo mismo pasa al pedir los cromos del equipo (DameAlbumEquipo)
    this.dbService.DameInscripcionEquipoJuegoDeColeccion(juegoSeleccionado.id, equipoDestinatarioId)
    .subscribe( inscripcion => 
                            this.dbService.AsignarCromoEquipo(new AlbumEquipo(inscripcion[0].id, cromo.id))
                            .subscribe()
              );
    this.dbService.DameInscripcionEquipoJuegoDeColeccion(juegoSeleccionado.id, equipoQueRegalaId)
    .subscribe( inscripcion => 
                                this.dbService.DameAlbumEquipo(cromo.id, inscripcion[0].id)
                                .subscribe( album => 
                                                    this.dbService.BorrarAlbumEquipo(album[0].id)
                                                    .subscribe()));
  }

  public RegalaCromoAlumnoEquipo(cromo: any, alumnoDestinatarioId: number, alumnoQueRegalaId: number, juegoSeleccionado: any) {
    // Es un juego en equipo pero asignación individual. Por tanto hay que quitar el cromo de los albunes de los equipos
    this.DameEquipoAlumnoEnJuegoDeColeccion (alumnoDestinatarioId, juegoSeleccionado.id)
    .subscribe ( equipoDestinatorio => {
      this.DameEquipoAlumnoEnJuegoDeColeccion (alumnoQueRegalaId, juegoSeleccionado.id)
      .subscribe ( equipoDeAlumnoQueRegala => {
        this.RegalaCromoEquipos (cromo, equipoDestinatorio.id, equipoDeAlumnoQueRegala.id, juegoSeleccionado);
      });
    });
  }
  public DameEquipoAlumnoEnJuegoDeColeccion(alumnoId: any, juegoId: any): any {
    const equipoObservable = new Observable(obs => {
      console.log ('HOLAAAAAAAAAAAAAAAavoy a por el equipo de este alumno en el juego');
      console.log ('Parametros de entrada: alumnoId:',alumnoId,'juegoId:',juegoId);

      // primero traigo los equipos que participan en el juego
     
      this.dbService.DameEquiposJuegoDeColeccion (juegoId)
      .subscribe (equiposJuego => {
                                    console.log ('equipos del juego',equiposJuego);
                                    
                                    console.log("FALLO1");
                                   

                                    // ahora traigo los equipos a los que pertenece el alumno
                                    this.dbService.DameEquiposDelAlumno (alumnoId)
                                    .subscribe (equiposAlumno => {
                                                                  console.log("FALLO2")
                                                                  console.log ('equipos del alumno:',equiposAlumno);
                                                                  // ahora miro cual es el equipo que está en ambas listas
                                                                  const equipo = equiposAlumno.filter(e => equiposJuego.some(a => a.id === e.id))[0];
                                                                  console.log ('interseccion');
                                                                  console.log (equipo);
                                                                  obs.next (equipo);
                                                                  });

                                  });

    });
    return equipoObservable;
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////////////Puntos
  public DameHistorialMisPuntos(juegoId: number, alumnoId: number): any {
    // const HistorialPuntos: any [] = [];
    const Observables = new Observable(obs => {
      const EsteAlumnoJDP: any[] = [];
      const HistorialPuntos: any[] = [];
      this.dbService.DameInscripcionAlumnoJuegoDePuntos(alumnoId, juegoId)
      .subscribe(MiAlumnoJuegoDePuntos => {
                                            EsteAlumnoJDP.push(MiAlumnoJuegoDePuntos[0].PuntosTotalesAlumno);
                                            this.dbService.DamePuntosJuegoDePuntos(juegoId)
                                            .subscribe(TipoDePuntos => {
                                                                        for (let i = 0; i < TipoDePuntos.length; i++) {
                                                                        this.dbService.DameHistorialDeUnPunto(MiAlumnoJuegoDePuntos[0].id, TipoDePuntos[i].id)
                                                                        .subscribe(HistorialDeUnPunto => {
                                                                                                            console.log(MiAlumnoJuegoDePuntos);
                                                                                                            console.log(HistorialDeUnPunto);
                                                                                                            this.puntos = 0;
                                                                                                            // tslint:disable-next-line:prefer-for-of
                                                                                                            for (let j = 0; j < HistorialDeUnPunto.length; j++) {
                                                                                                              this.puntos = this.puntos + HistorialDeUnPunto[j].ValorPunto;
                                                                                                              console.log('acumulo punto' + this.puntos);
                                                                                                            }
                                                                                                            HistorialPuntos.push({ Nombre: TipoDePuntos[i].Nombre, Puntos: this.puntos });
                                                                                                           });
                                                                                                                        }
                                                                        });
                                            });
      const MisObservables = { AlumnoJDP: EsteAlumnoJDP, Historial: HistorialPuntos };
      obs.next(MisObservables);
    });
    return Observables;
  }

  
  public PrepararTablaRankingIndividual(listaAlumnosOrdenadaPorPuntos,
    alumnosDelJuego,
    nivelesDelJuego): any {

const rankingJuegoDePuntos: any[] = [];
// tslint:disable-next-line:prefer-for-of
for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
let alumno: any;
let nivel: any;
const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
const nivelId = listaAlumnosOrdenadaPorPuntos[i].nivelId;
alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];

if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
nivel = nivelesDelJuego.filter(res => res.id === nivelId)[0];
}

if (nivel !== undefined) {
rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.id, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

} else {
rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.id, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
}
}

return (rankingJuegoDePuntos);

}

public PrepararTablaRankingEquipos(
  listaEquiposOrdenadaPorPuntos: any,
  equiposDelJuego: any,
  nivelesDelJuego: any,

): any {
  const rankingEquiposJuegoDePuntos: any[] = [];
  // const rankingEquiposJuegoDePuntosTotal: any [] = [];
  for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
    console.log('Bucle principal');
    let equipo: any;
    let nivel: any;
    equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

    if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
      console.log(listaEquiposOrdenadaPorPuntos[i].equipoId);
      nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
      console.log(listaEquiposOrdenadaPorPuntos[i].nivelId);
    }

    if (nivel !== undefined) {
      rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
        listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

      // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
      //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
    } else {
      rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
        listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

      // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
      //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
    }
  }

  // const resultado = {
  //                       ranking: rankingEquiposJuegoDePuntos,
  //                       rankingTotal: rankingEquiposJuegoDePuntosTotal
  // };
  return rankingEquiposJuegoDePuntos;
}

public PreparaHistorialEquipo(equipoJuegoDePuntos: any, tiposPuntosDelJuego: any, ):
any {
const historialObservable = new Observable(obs => {

  let historial = [];

  this.dbService.DameHistorialPuntosEquipo(equipoJuegoDePuntos.id)
    .subscribe(his => {

      if (his[0] !== null) {
        for (let i = 0; i < his.length; i++) {
          console.log('voy ' + i);
          const punto = tiposPuntosDelJuego.filter(res => res.id === his[i].puntoId)[0];

          historial[i] = new TablaHistorialPuntosEquipo(punto.Nombre,
            punto.Descripcion, his[i].ValorPunto, his[i].fecha,
            his[i].equipoJuegoDePuntosId, his[i].id, his[i].puntoId);
        }
      } else {
        historial = undefined;
      }
      historial = historial.filter(res => res.nombre !== '');
      obs.next(historial);
    });
});
return historialObservable;
}

public PreparaHistorialAlumno(alumnoJuegoDePuntos: any, tiposPuntosDelJuego: any, ):
    any {
    const historialObservable = new Observable(obs => {

      let historial = [];

      this.dbService.DameHistorialPuntosAlumno(alumnoJuegoDePuntos.id)
        .subscribe(his => {

          if (his[0] !== null) {
            for (let i = 0; i < his.length; i++) {
              console.log('voy ' + i);
              const punto = tiposPuntosDelJuego.filter(res => res.id === his[i].puntoId)[0];

              historial[i] = new TablaHistorialPuntosAlumno(punto.Nombre,
                punto.Descripcion, his[i].ValorPunto, his[i].fecha,
                his[i].alumnoJuegoDePuntosId, his[i].id, his[i].puntoId);
            }
          } else {
            historial = undefined;
          }
          historial = historial.filter(res => res.nombre !== '');
          obs.next(historial);
        });
    });
    return historialObservable;
  }

}