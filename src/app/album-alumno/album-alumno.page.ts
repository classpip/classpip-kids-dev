import { Component, OnInit } from '@angular/core';
import { SesionService } from '../Servicios/sesion.service';
import { DbServiceService } from '../db-service.service';
import * as URL from '../URLs/urls';

@Component({
  selector: 'app-album-alumno',
  templateUrl: './album-alumno.page.html',
  styleUrls: ['./album-alumno.page.scss'],
})
export class AlbumAlumnoPage implements OnInit {

  constructor(private sesion: SesionService,
              private dbService: DbServiceService) { }

  coleccion: any;
  cromosAlumno: any[]=[];
  cromosColeccion: any[]=[];
  imagenCromoDelante: any[]=[];
  imagenCromoDetras: any[]=[];
  cromo:any;
  tengoCromo: boolean[] = [];
  voltear = false;


  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();
    console.log("Coleccion: ",this.coleccion);
    this.cromosAlumno = this.sesion.DameCromos();
    console.log("Cromos Alumno:: ",this.cromosAlumno);
    this.CromosDeLaColeccion(this.coleccion);
  }

    // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
    
    CromosDeLaColeccion(coleccion: any) {

    console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);
    // Busca los cromos dela coleccion en la base de datos
    this.dbService.DameCromosColeccion(coleccion.id)
    .subscribe(res => {
                      if (res[0] !== undefined) {
                        this.cromosColeccion = res;
                        this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
                        this.PreparaImagenesCromos();
                        this.PreparaAlbum();
                        console.log(res);
                      } 
                      else {
                            console.log('No hay cromos en esta coleccion');
                            // Mensaje usuario
                            this.cromosColeccion = undefined;
                           }
                      });
  }

   // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
   PreparaImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      let cromo: any;
      cromo = this.cromosColeccion[i];
      this.imagenCromoDelante[i] = URL.ImagenesCromo + cromo.ImagenDelante;

      if (this.coleccion.DosCaras ) {
        this.imagenCromoDetras[i] = URL.ImagenesCromo + cromo.ImagenDetras;
      }
    }
  }

  PreparaAlbum() {
    console.log ('cromos del alumno');
    console.log (this.cromosAlumno);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosAlumno.filter(res => res.id === this.cromosColeccion[i].id)[0];


      if (this.cromo !== undefined) {
        this.tengoCromo[i] = true;
      } else {
        this.tengoCromo[i] = false;
      }
    }

  }
  Voltear() {
    this.voltear = !this.voltear;
  }

}
