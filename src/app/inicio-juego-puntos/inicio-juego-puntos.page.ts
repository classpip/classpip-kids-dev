import { Component, OnInit, ViewChild } from '@angular/core';
import { DbServiceService } from '../db-service.service';
import { CalculosService } from '../Servicios/calculo.coleccion';
import { TablaEquipoJuegoDePuntos } from '../home/clases/TablaEquipoJuegoDePuntos';
import { IonContent } from '@ionic/angular';
import { SesionService } from '../Servicios/sesion.service';
import { TablaAlumnoJuegoDePuntos } from '../home/clases/TablaAlumnoJuegoDePuntos';


@Component({
  selector: 'app-inicio-juego-puntos',
  templateUrl: './inicio-juego-puntos.page.html',
  styleUrls: ['./inicio-juego-puntos.page.scss'],
})

export class InicioJuegoPuntosPage implements OnInit {

  constructor(
                private calculos: CalculosService,
                private dbService:DbServiceService, //(MOVIL ESTUDIANTE): peticionesAPI: PeticionesAPIService,
                private sesion:SesionService

  ) { }

  
  @ViewChild('content', { static: false }) content: IonContent;
  toggleInfoView() {
    this.infoView = !this.infoView;
  }
  


  ///////VARIABLES
  juegoSeleccionado:any;
  MiAlumno:any;
  nivelesDelJuego:any[]=[];
  TodosLosPuntos: any[]=[];
  EsteAlumnoJuegoDePuntos: any[]=[];
  MiHistorialPuntos:any[]=[];
  MiAlumnoJDP: number;
  alumnosDelJuego: any[]=[];
  listaAlumnosOrdenadaPorPuntos: any[]=[];
  rankingJuegoDePuntos:any[]=[];
  rankingEquiposJuegoDePuntos: any[]=[];
  listaEquiposOrdenadaPorPuntos:any[]=[];
  equiposDelJuego:any[]=[];
  MiEquipo: any;
  infoPuntosView: boolean = false;
  equipoJuegoDePuntos: any;
  historialequipo:any;
  alumnoJuegoDePuntos:any;
  historialalumno:any[]=[];
  public hideMe: boolean = false;
  infoView: boolean = false;

   // EN el panel que muestra la info, enseñaremos los puntos de porfma preddeterminada
   Tipo: String;

  ///////VARIABLES


  async ngOnInit() {
    this.juegoSeleccionado = await this.dbService.DameJuegodePuntoseleccionado(localStorage.getItem("idjuegodepuntos")).toPromise();
    this.MiAlumno = await this.dbService.dameAlumnoPorId(localStorage.getItem("alumnoID")).toPromise();
    console.log(this.MiAlumno);
    console.log(this.juegoSeleccionado[0].id);
    console.log("Modo:",this.juegoSeleccionado[0].Modo);


    this.NivelesJuego();
    this.DamePuntosDelJuego();
    if (this.juegoSeleccionado[0].Modo === 'Individual') {
      this.calculos.DameHistorialMisPuntos(this.juegoSeleccionado[0].id, this.MiAlumno.id)
      .subscribe(lista => {
                            console.log(lista);
                            this.EsteAlumnoJuegoDePuntos = lista.AlumnoJDP;
                            console.log(this.EsteAlumnoJuegoDePuntos[0]);
                            this.MiHistorialPuntos = lista.Historial;
                            this.dbService.DameInscripcionAlumnoJuegoDePuntos(this.MiAlumno.id, this.juegoSeleccionado[0].id)
                            .subscribe(AlumnoJDP => {
                                                      this.MiAlumnoJDP = AlumnoJDP[0].PuntosTotalesAlumno;
                                                      console.log(this.MiAlumnoJDP);
                                                    });
                            });
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }

  // Recupera los niveles de los que dispone el juego
  NivelesJuego() {
    this.dbService.DameNivelesJuegoDePuntos(this.juegoSeleccionado[0].id)
      .subscribe(niveles => {
        this.nivelesDelJuego = niveles;
        console.log('Los niveles del juego son')
        console.log(this.nivelesDelJuego)
        for (let i = 0; i < this.nivelesDelJuego.length; i++) {
          console.log('entro a buscar nivel y foto');
          console.log(this.nivelesDelJuego[i]);
          if (this.nivelesDelJuego[i].Imagen !== undefined) {
            // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
            this.dbService.DameImagenNivel(this.nivelesDelJuego[i].Imagen)
              .subscribe(response => {
                const blob = new Blob([response.blob()], { type: 'image/jpg' });
    
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  this.nivelesDelJuego[i].Imagen = reader.result.toString();
                }, false);
    
                if (blob) {
                  reader.readAsDataURL(blob);
                }
              });
    
            // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
          } else {
            this.nivelesDelJuego[i].Imagen = undefined;
          }
        }
      });
  }

  DamePuntosDelJuego() {
    this.dbService.DamePuntosJuegoDePuntos(this.juegoSeleccionado[0].id)
    .subscribe(puntos => {
                          this.TodosLosPuntos = puntos;
                          console.log(this.TodosLosPuntos);
                         });
  }

   // Recupera los alumnos que pertenecen al juego
   AlumnosDelJuego() {
    console.log('Vamos a pos los alumnos');
    this.dbService.DameAlumnosJuegoDePuntos(this.juegoSeleccionado[0].id)
      .subscribe(alumnosJuego => {
        console.log('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
RecuperarInscripcionesAlumnoJuego() {
  this.dbService.DameInscripcionesAlumnoJuegoDePuntos(this.juegoSeleccionado[0].id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function (obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log('ya tengo las inscripciones');
      console.log(this.listaAlumnosOrdenadaPorPuntos);
      // this.OrdenarPorPuntos();
      this.TablaClasificacionTotal();
    });
}
// En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
// ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
// Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS
TablaClasificacionTotal() {

  if (this.juegoSeleccionado[0].Modo === 'Individual') {
    this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividual(
      this.listaAlumnosOrdenadaPorPuntos,
      this.alumnosDelJuego,
      this.nivelesDelJuego
    );
    console.log('Ya tengo la tabla');
    console.log(this.rankingJuegoDePuntos);
  } else {

    this.rankingEquiposJuegoDePuntos = this.calculos.PrepararTablaRankingEquipos(
      this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego
    );
    console.log('ranking ' + this.rankingEquiposJuegoDePuntos);
    console.log(this.rankingEquiposJuegoDePuntos);
  }
}
  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.dbService.DameEquiposJuegoDePuntos(this.juegoSeleccionado[0].id)
      .subscribe(equiposJuego => {
        console.log('ya tengo los equipos');
        this.equiposDelJuego = equiposJuego;
        this.RecuperarInscripcionesEquiposJuego();
        this.DameEquipoAlumnoConectado();
      });

  }
  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
RecuperarInscripcionesEquiposJuego() {
  console.log('vamos por las inscripciones ' + this.juegoSeleccionado.id);
  this.dbService.DameInscripcionesEquipoJuegoDePuntos(this.juegoSeleccionado[0].id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);

      // ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function (obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log('ya tengo las inscripciones');
      this.TablaClasificacionTotal();
      console.log(this.MiEquipo);
    });
}

DameEquipoAlumnoConectado() {
  console.log('voy a por el equipo del alumno');
  for ( let i = 0; i < this.equiposDelJuego.length; i++){
    this.dbService.DameAlumnosEquipo(this.equiposDelJuego[i].id)
    .subscribe(res => {
      console.log('miro en: ' + this.equiposDelJuego[i]);
      for (let j = 0; j < res.length; j++)
        if (res[j].id === this.MiAlumno.id) {
          console.log(res);
          this.MiEquipo = this.equiposDelJuego[i];
          console.log('tu equipo');
          console.log(this.MiEquipo);
        }
    });
  }
}

MuestrameInfoEquipoSeleccionado(equipo: TablaEquipoJuegoDePuntos) {
  this.MuestraHistorial();
  const equipoSeleccionado = this.equiposDelJuego.filter(res => res.Nombre === equipo.nombre)[0];


  const posicion = this.rankingEquiposJuegoDePuntos.filter(res => res.nombre === equipo.nombre)[0].posicion;
  console.log(posicion);
  // Informacion que se necesitara para ver la evolución del equipo

  this.sesion.TomaDatosEvolucionEquipoJuegoPuntos(
    posicion,
    equipoSeleccionado,
    this.listaEquiposOrdenadaPorPuntos.filter(res => res.equipoId === equipoSeleccionado.id)[0],
    this.nivelesDelJuego,
    this.TodosLosPuntos
  );
  this.MostrarHistorialSeleccionado();
}
MostrarHistorialSeleccionado() {
  const res = this.sesion.DameDatosEvolucionEquipoJuegoPuntos();
  this.equipoJuegoDePuntos = res.inscripcionEquipoJuego;
  // traigo el historial
  this.calculos.PreparaHistorialEquipo(this.equipoJuegoDePuntos, this.TodosLosPuntos).
    subscribe(res => {
      this.historialequipo = res;
      console.log(this.historialequipo);
    });
}
  
AccederAlumno(alumno: TablaAlumnoJuegoDePuntos) {
  this.MuestraHistorial();
  const alumnoSeleccionado = this.alumnosDelJuego.filter(res => res.Nombre === alumno.nombre &&
    res.PrimerApellido === alumno.primerApellido && res.SegundoApellido === alumno.segundoApellido)[0];

  const posicion = this.rankingJuegoDePuntos.filter(res => res.nombre === alumno.nombre &&
    res.primerApellido === alumno.primerApellido && res.segundoApellido === alumno.segundoApellido)[0].posicion;

  // Informacion que se necesitara para ver la evolución del alumno
  this.sesion.TomaDatosEvolucionAlumnoJuegoPuntos (
    posicion,
    this.TodosLosPuntos,
    this.nivelesDelJuego,
    alumnoSeleccionado,
    this.listaAlumnosOrdenadaPorPuntos.filter(res => res.alumnoId === alumnoSeleccionado.id)[0],
  );
  this.HistorialTotal();
}
HistorialTotal() {
  const res = this.sesion.DameDatosEvolucionAlumnoJuegoPuntos();
  this.alumnoJuegoDePuntos = res.inscripcionAlumnoJuego;
  // traigo el historial
  this.calculos.PreparaHistorialAlumno(this.alumnoJuegoDePuntos, this.TodosLosPuntos).
    subscribe(res => {
      this.historialalumno = res;
      console.log(this.historialalumno);
    });
}

// Muestra los puntos de cada alumno-equipo
MuestraHistorial() {
  this.infoPuntosView = !this.infoPuntosView;
}

// MuestraElRanking() {
//   this.hideMe = true;
//   this.scrollToBottom();
//   console.log(this.hideMe)
// }
// OcultarElRanking(){
//   this.scrollToTop();
//   this.hideMe = false;
//   console.log(this.hideMe)
// }

// scrollToBottom(): void {
//   this.content.scrollToBottom(800);
// }
// scrollToTop() {
//   this.content.scrollToTop();
// }

// configuramos el slider de los cromos
sliderConfig = {
  slidesPerView: 1.6,
  spaceBetween: 10,
  centeredSlides: true
};

// Cerrar otros dialogos de puntos del equipo si estuvieran abiertos
cierraHistorial() {
  if (this.infoPuntosView == true) {
    this.infoPuntosView = false;
  }
}

ionViewWillEnter (){
  this.Tipo = "Puntos";
}

}
