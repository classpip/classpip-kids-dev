import { Component, OnInit } from '@angular/core';
import { DbServiceService } from 'src/app/Servicios/peticionesAPI'
import { Router } from '@angular/router';
import { juegolibro } from '../clases/juegolibro'
import { AlertController } from '@ionic/angular';
import { element } from 'protractor';
import { CalculosService } from '../Servicios/calculo.coleccion';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-mis-juegos',
  templateUrl: './mis-juegos.page.html',
  styleUrls: ['./mis-juegos.page.scss'],
})
export class MisJuegosPage implements OnInit {

  listaDeJuegosDeAlumno: any[] = [];
  listaDeJuegoColeccionDeAlumno: any[] = [];
  listaDeJuegoColeccionDeAlumno2: any[] = [];
  lista: juegolibro;
  listaColeccion: any;
  listaAuxiliar: any[] = []; // No veo ningun Cambio poniendola en Any en vez de juegolibro[]
  elementoauxiliarirjuego: any[] = [];
  valori: number;
  //listaAuxiliar:  juegolibro[] = [];

  seleccionado: boolean[];
  categorias: boolean[];
  contador: number = 0;
  id: number = 0;

  gruposId: number;
  listaparaversiestaalumno: any[] = [];
  alumno: any;
  juegosalumnoestaenelgrupo: any[] = [];
  juegosdePuntos: any[] = [];
  juegoPuntoseleccionado: any;
  juegosMemorama: any[] = [];
  alumnopertecejuegomemorama: any[] = [];
  trueofalse: any;

  juegosPuzzle: any[] = [];
  alumnopertecejuegoPuzzle: any[] = [];


  constructor(private router: Router, private dBservice: DbServiceService, private alertController: AlertController, private calculos: CalculosService) { }

  async ngOnInit() {


  }

  async ionViewWillEnter() {

    //////////////////////////////////////////////////////////////////////////////////PARTE MEMORAMA
    this.juegosMemorama = await this.dBservice.DameJuegoDeMemorama().toPromise();
    console.log("Juego Memorama:", this.juegosMemorama);
    for (let i = 0; this.juegosMemorama.length > i; i++) {

      this.alumnopertecejuegomemorama = await this.dBservice.DimesiAlumnoEsdelJuegoMemorama(this.juegosMemorama[0].id, localStorage.getItem("alumnoID")).toPromise();

      if (this.alumnopertecejuegomemorama.length > 0) {
        this.trueofalse = this.juegosMemorama[i].JuegoActivo;
        console.log("Pertenece al Juego Memorama");

        if (this.trueofalse === true) {
          console.log("HOLAAA");
          this.listaAuxiliar.push(this.juegosMemorama[i]);

        }
        else {
          console.log("Juego No Activo")
        }
        this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
        this.categorias = Array(this.listaAuxiliar.length).fill(false);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////PARTE MEMORAMA

    //////////////////////////////////////////////////////////////////////////////////PARTE PUZZLE
    this.juegosPuzzle = await this.dBservice.DameJuegoDePuzzle().toPromise();
    console.log("Juego Puzzle:", this.juegosPuzzle);
    for (let i = 0; this.juegosPuzzle.length > i; i++) {

      this.alumnopertecejuegoPuzzle = await this.dBservice.DimesiAlumnoEsdelJuegoPuzzle(this.juegosPuzzle[0].id, localStorage.getItem("alumnoID")).toPromise();

      if (this.alumnopertecejuegoPuzzle.length > 0) {
        this.trueofalse = this.juegosPuzzle[i].JuegoActivo;
        console.log("Pertenece al Juego Puzzle");

        if (this.trueofalse === true) {
          console.log("HOLAAA");
          this.listaAuxiliar.push(this.juegosPuzzle[i]);

        }
        else {
          console.log("Juego No Activo")
        }
        this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
        this.categorias = Array(this.listaAuxiliar.length).fill(false);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////PARTE PUZZLE



    this.juegosdePuntos = await this.dBservice.DameJuegoDePuntosAlumno(localStorage.getItem("alumnoID")).toPromise();
    console.log("Lista Juego de Puntos:", this.juegosdePuntos);

    for (let i = 0; this.juegosdePuntos.length > i; i++) {

      if (this.juegosdePuntos[i].JuegoActivo === true) {

        this.listaAuxiliar.push(this.juegosdePuntos[i])

      }
      else {
        console.log("Juego No Activo")
      }
      this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
      this.categorias = Array(this.listaAuxiliar.length).fill(false);
    }

    //RECIBO TODOS LOS JUEGOS DE COLECCION EN EQUIPOS QUE SEAN TRUE:

    this.listaDeJuegoColeccionDeAlumno2 = await this.dBservice.dameJuegosdeColeccionEquipoActivos().toPromise();
    console.log("listaDeJuegoColeccionEquipo2: ", this.listaDeJuegoColeccionDeAlumno2);

    this.alumno = await this.dBservice.dameAlumnoPorId(localStorage.getItem("alumnoID")).toPromise();
    console.log("Nombre Alumno:", this.alumno.Nombre);

    //AHORA DEBO MIRAR SI EN ESTOS JUEGOS PARTICIPA EL ALUMNO:

    for (let i = 0; this.listaDeJuegoColeccionDeAlumno2.length > i; i++) {
      this.gruposId = this.listaDeJuegoColeccionDeAlumno2[i].grupoId;
      this.listaparaversiestaalumno.push(await this.dBservice.GruposJuegoColecciondealumno(this.gruposId, this.alumno.Nombre).toPromise());
      console.log("Longitud:", this.listaparaversiestaalumno[i].length);

      if (this.listaparaversiestaalumno[i].length > 0) {

        this.juegosalumnoestaenelgrupo.push(this.listaDeJuegoColeccionDeAlumno2[i]);
        this.listaAuxiliar.push(this.juegosalumnoestaenelgrupo[i]);

      }
      this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
      this.categorias = Array(this.listaAuxiliar.length).fill(false);
    }

    console.log("Juegos donde está el Alumno:", this.juegosalumnoestaenelgrupo);


    this.listaDeJuegoColeccionDeAlumno = await this.dBservice.dameAlumnosJuegoDeColeccion(localStorage.getItem("alumnoID")).toPromise();
    console.log("listaDeJuegoColeccionAlumno: ", this.listaDeJuegoColeccionDeAlumno);


    //Pedimos a la base de datos todos los juegos a los que pertenece nuestro alumno
    this.listaDeJuegosDeAlumno = await this.dBservice.dameAlumnosJuegoDeCuento(localStorage.getItem("alumnoID")).toPromise();


    for (let i = 0; i < this.listaDeJuegosDeAlumno.length; i++) {
      //pido informacion de cada juego
      this.lista = await this.dBservice.dameJuegosDelAlumno(this.listaDeJuegosDeAlumno[i].juegoId).toPromise();

      if (this.lista.JuegoActivo === true) {
        this.listaAuxiliar.push(this.lista);
      }

      this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
      this.categorias = Array(this.listaAuxiliar.length).fill(false);

    }

    console.log("Lista Cuentos:", this.lista);

    /////////////////////////////////////////////////////AÑADIDO Juego Coleecion


    for (let j = 0; j < this.listaDeJuegoColeccionDeAlumno.length; j++) {
      //pido informacion de cada juego
      this.listaColeccion = await this.dBservice.dameJuegosColeccionDelAlumno(this.listaDeJuegoColeccionDeAlumno[j].juegoDeColeccionId).toPromise();

      if (this.listaColeccion.JuegoActivo === true) {
        this.listaAuxiliar.push(this.listaColeccion);
      }

      this.seleccionado = Array(this.listaAuxiliar.length).fill(false);
      this.categorias = Array(this.listaAuxiliar.length).fill(false);

    }
    console.log("Lista Coleccion:", this.listaColeccion);

    /////////////////////////////////////////////////////AÑADIDO Juego Coleecion


    console.log("ListaAuxiliar: ", this.listaAuxiliar);
    console.log(this.seleccionado);


  }


  /**
   * Cuando se selecciona un checkbox, los otros checkbox restantes son desactivados
   * @param x Posición del checkbox seleccionado
   */
  selection(x: any) {

    this.contador++;
    for (let i = 0; i < this.seleccionado.length; i++) {
      if (i !== x) {
        this.categorias[i] = !this.categorias[i];
        this.seleccionado[i] = false;
      }
      else {
        if (this.contador % 2 == 0) this.seleccionado[i] = false;
        else this.seleccionado[i] = true;
      }

    }
    console.log("seleccionados")
    console.log(this.seleccionado);
  }


  /**
   * Vamos al juego seleccionado por el alumno
   */

  //////////////////////////////////////AÑADIDO: Le he añadido el async porquesino en elementoauxiliar me salia todo el rato observable en ve de un valor
  async irJuego() {

    let count: boolean;
    count = false;

    for (let i = 0; i < this.seleccionado.length; i++) {
      if (this.seleccionado[i]) {

        // CUENTOS

        if (this.listaAuxiliar[i].Tipo === "Juego De Cuentos") {
          this.elementoauxiliarirjuego = await this.dBservice.dameAlumnosJuegoDeCuentoxjuegocoleid(localStorage.getItem("alumnoID"), this.listaAuxiliar[i].id).toPromise();
          console.log("ELEMENTO JUEGO CUENTO: ", this.elementoauxiliarirjuego);
          console.log(this.elementoauxiliarirjuego[0].id);

          localStorage.setItem("idAlumnoJuego", this.elementoauxiliarirjuego[0].id);
          console.log("Id : ", this.elementoauxiliarirjuego[0].id);
          count = true;
          this.valori = i;

        }

        // COLECCION

        else if (this.listaAuxiliar[i].Tipo === "Juego De Colección") {

          if (this.listaAuxiliar[i].Modo === "Equipos") {
            localStorage.setItem("idjuegodecoleccion", this.listaAuxiliar[i].id);
          }

          else {

            this.elementoauxiliarirjuego = await this.dBservice.dameAlumnosJuegoDeColeccionxjuegocoleid(localStorage.getItem("alumnoID"), this.listaAuxiliar[i].id).toPromise();
            localStorage.setItem("idjuegodecoleccion", this.elementoauxiliarirjuego[0].juegoDeColeccionId);
          }

          console.log("Identificador juego coleccion:", localStorage.getItem("idjuegodecoleccion"));
          count = true;
          this.valori = i;

        }

        // PUNTOS

        else if (this.listaAuxiliar[i].Tipo === "Juego De Puntos") {
          localStorage.setItem("idjuegodepuntos", this.listaAuxiliar[i].id);
          console.log("Identificador juego Puntos:", localStorage.getItem("idjuegodepuntos"));
          count = true;
          this.valori = i;
        }

        // MEMORAMA

        else if (this.listaAuxiliar[i].Tipo === "Juego De Memorama"){
          localStorage.setItem("juegoDeMemoramaId", this.listaAuxiliar[i].id);
          localStorage.setItem("familiaId", this.listaAuxiliar[i].familiaId);
          localStorage.setItem("idcartas", this.listaAuxiliar[i].idcartas);
          localStorage.setItem("tiempoduracion", this.listaAuxiliar[i].tiempoduracion);
          localStorage.setItem("puntuacionCorrecta", this.listaAuxiliar[i].puntuacionCorrecta);
          localStorage.setItem("puntuacionIncorrecta", this.listaAuxiliar[i].puntuacionIncorrecta);
          localStorage.setItem("dificultad", this.listaAuxiliar[i].dificultad);

          console.log("Identificador juego Memorama:", localStorage.getItem("juegoDeMemoramaId"));
          count = true;
          this.valori = i;
        }

        //PUZZLE

        else if (this.listaAuxiliar[i].Tipo === "Juego De Puzzle"){
          localStorage.setItem("juegoDePuzzleId", this.listaAuxiliar[i].id);
          localStorage.setItem("dificultad", this.listaAuxiliar[i].Dificultad);
          localStorage.setItem("puntos", this.listaAuxiliar[i].Puntos);
          localStorage.setItem("Tiempo", this.listaAuxiliar[i].Tiempo);
          localStorage.setItem("NombreImagen", this.listaAuxiliar[i].NombreImagen);

          console.log("Identificador juego Puzzle:", localStorage.getItem("juegoDePuzzleId"));
          console.log("Dificultad Puzzle:", localStorage.getItem("dificultad"));
          console.log("ModoJuego Puzzle:", localStorage.getItem("modojuego"));
          console.log("NOMBRE IMAGEN: " + this.listaAuxiliar[i].NombreImagen)
          count = true;
          this.valori = i;
        }

      }

    }

    if (count) {


      if (this.listaAuxiliar[this.valori].Tipo === "Juego De Cuentos") {
        this.listaAuxiliar = [];
        this.contador = 0;
        console.log("Estoy en el count = true(CUENTO)")
        this.router.navigate(['/inicio']);
      }
      else if (this.listaAuxiliar[this.valori].Tipo === "Juego De Colección") {

        this.listaAuxiliar = [];
        this.contador = 0;
        console.log("Estoy en el count = true(COLECCION)")
        this.router.navigate(['/inicio-juego-coleccion']);

      }
      else if (this.listaAuxiliar[this.valori].Tipo === "Juego De Puntos") {
        this.listaAuxiliar = [];
        this.contador = 0;
        console.log("Estoy en el count = true(PUNTOS)")
        this.router.navigate(['/inicio-juego-puntos']);
      }
      else if (this.listaAuxiliar[this.valori].Tipo === "Juego De Memorama") {
        this.listaAuxiliar = [];
        this.contador = 0;
        console.log("Estoy en el count = true(MEMORAMA)")
        // this.router.navigate(['/memorama-coleccion']);
        this.router.navigate(['/pruebamemorama']);
        // this.router.navigate(['/fondoanimado']);
      }
      else if (this.listaAuxiliar[this.valori].Tipo === "Juego De Puzzle") {
        this.listaAuxiliar = [];
        this.contador = 0;
        console.log("Estoy en el count = true(Puzzle)")
        this.router.navigate(['/juego-puzzle']);
      }
    }

    else

      this.alertaJuegoNoSeleccionado();

  }

  /**
   * Vuelve al menu-principal
   */
  irMenuPrincipal() {
    this.listaAuxiliar = [];
    this.contador = 0;
    this.router.navigate(['/menu-principal'])
  }

  /**
   * Alerta que avisa que no se ha seleccionado ningún juego
   */
  async alertaJuegoNoSeleccionado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ERROR',
      message: 'Debes seleccionar un juego',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  /**
   * Pedimos a la base de datos todos los juegos a los que pertenece nuestro alumno
   */
  async obtengoAlumnos() {

    this.dBservice.dameAlumnosJuegoDeCuento(localStorage.getItem("alumnoID")).subscribe(juegos => {

      if (juegos.length != 0) {

        console.log(juegos);
        this.listaDeJuegosDeAlumno = juegos;
        console.log(this.listaDeJuegosDeAlumno);
      }
      else console.log("no tiene juegos disponibles");

    }
    );
  }

}
