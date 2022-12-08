
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

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  

    coleccion: any;
    cromos:any;
    posicion:any;
    equipoSeleccionado:any;
    inscripcionEquipoJuego:any;
    nivelesDelJuego:any;
    tiposPuntosDelJuego:any;
    alumnoSeleccionado:any;
    inscripcionAlumnoJuego:any;

    constructor() { }

    public TomaColeccion(coleccion: any) {
        this.coleccion = coleccion;
      }
      
    
      public TomaCromos(cromosColeccion: any[]) {
        this.cromos = cromosColeccion;
      }

      public DameCromos(): any[] {
        return this.cromos;
      }

      public DameColeccion(): any {
        return this.coleccion;
      }

      public TomaDatosEvolucionEquipoJuegoPuntos(
        posicion: any,
        equipoSeleccionado: any,
        inscripcionEquipoJuego: any,
        nivelesDelJuego: any,
        tiposPuntosDelJuego) {
        this.posicion = posicion;
        this.equipoSeleccionado = equipoSeleccionado;
        this.inscripcionEquipoJuego = inscripcionEquipoJuego;
        this.nivelesDelJuego = nivelesDelJuego;
        this.tiposPuntosDelJuego = tiposPuntosDelJuego;
    
      }
      public DameDatosEvolucionAlumnoJuegoPuntos(): any {
        const datos = {
          posicion: this.posicion,
          tiposPuntosDelJuego: this.tiposPuntosDelJuego,
          nivelesDelJuego: this.nivelesDelJuego,
          alumnoSeleccionado: this.alumnoSeleccionado,
          inscripcionAlumnoJuego: this.inscripcionAlumnoJuego
        };
        return datos;
      }
      public DameDatosEvolucionEquipoJuegoPuntos(): any {
        const datos = {
          posicion: this.posicion,
          equipoSeleccionado: this.equipoSeleccionado,
          inscripcionEquipoJuego: this.inscripcionEquipoJuego,
          nivelesDelJuego: this.nivelesDelJuego,
          tiposPuntosDelJuego: this.tiposPuntosDelJuego
        };
        return datos;
      }

      
  public TomaDatosEvolucionAlumnoJuegoPuntos(posicion: any,
    tiposPuntosDelJuego: any,
    nivelesDelJuego: any,
    alumnoSeleccionado: any,
    inscripcionAlumnoJuego: any) {
    this.posicion = posicion;
    this.tiposPuntosDelJuego = tiposPuntosDelJuego;
    this.nivelesDelJuego = nivelesDelJuego;
    this.alumnoSeleccionado = alumnoSeleccionado;
    this.inscripcionAlumnoJuego = inscripcionAlumnoJuego;
  }

}