import { Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { table } from 'console';
import { DbServiceService } from 'src/app/db-service.service';
import * as URL from '../URLS/urls';
import { alumnojuegomemorama } from '../alumnojuegomemorama';
// import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
  selector: 'app-pruebamemorama',
  templateUrl: './pruebamemorama.page.html',
  styleUrls: ['./pruebamemorama.page.scss'],
})
export class PruebamemoramaPage implements OnInit, AfterViewChecked {
  entrar: any;
  segundos: any;
  minutos: any;
  dificultad: string;
  fondo: any;
  Nombreinicial: any;
  familiainfo: any;
  alertacancionglobal: boolean;
  puntuacionHTML: any;
  tiempoHTML: any;
  acabao = false;
  instrucciones = true;
  botonayudausado: number;

  constructor(private dbService: DbServiceService, private router: Router,private location: Location) { }

  textHijo1: string;
  iconos;
  Cartaspartedetras: any[] = [];
  selecciones: any[] = [];
  juegoDeMemoramaId;
  familiaId;
  damecartasdelafamilia: any[] = [];
  damecartasdelafamilia2: any[] = [];
  preparado = false;
  tarjetasayuda: any[] = [];
  contadorpos = 0;
  contadorneg = 0;
  idcartasjuego: any;
  relacion = false;
  separador = ",";
  idcartasseparadas: any[] = [];
  puntuacionCorrecta: any;
  puntuacionIncorrecta: any;
  identificador: any;
  familiaparafondo: any;
  puntosposibles: number;

  //Tiempo
  tiempoinicial: any;
  tempo = false;
  tiempoduracion: number;

  elalumno: any;
  nombrealumno: any;


  ngOnInit() {


    console.log("ionViewWillEnter");
    this.entrar = 0;
    this.botonayudausado=0;

    this.damenombre();

    // this.nombrealumno=this.elalumno[0].Nombre;


    // RECOJO LAS VARIABLES juegoDeMemoramaId y la familiaId
    this.juegoDeMemoramaId = localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");
    this.idcartasjuego = localStorage.getItem("idcartas");
    // this.relacion = localStorage.getItem("relacion");
    this.puntuacionCorrecta = localStorage.getItem("puntuacionCorrecta");
    this.puntuacionIncorrecta = localStorage.getItem("puntuacionIncorrecta");
    this.dificultad = localStorage.getItem("dificultad")
    this.tiempoduracion = Number(localStorage.getItem("tiempoduracion"));

    if (this.dificultad === "facil") {
      this.puntosposibles = 4;
    }
    else if (this.dificultad === "media") {
      this.puntosposibles = 5;
    }
    else {
      this.puntosposibles = 6;
    }

    this.Relacion();

    console.log("RELACIOOON", this.relacion)


    this.DividirIDcartas(this.idcartasjuego, this.separador);
    console.log(this.idcartasjuego[0]);
    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId, "familiaId:", this.familiaId, "idcartas", this.idcartasjuego);

    this.dbService.DimesiAlumnoEsdelJuegoMemorama(this.juegoDeMemoramaId, localStorage.getItem("alumnoID")).subscribe(alumno => {
      this.identificador = alumno[0].id;
      console.log(alumno[0].id)
    })


    // Pido las cartas del Alumno

    this.DameLasCartasDelAlumno();



  }



  ngAfterViewChecked() {
    this.DimensionesTablero();


  }

  Desactivarinstrucciones() {
    this.instrucciones = false;
  }

  dameidentificador() {
    this.dbService.DimesiAlumnoEsdelJuegoMemorama(this.juegoDeMemoramaId, localStorage.getItem("alumnoID")).subscribe(alumno => {
      this.identificador = alumno[0].id;
      console.log(alumno[0].id)
    })
  }

  contador0() {

    console.log("DATOOS", this.juegoDeMemoramaId, this.identificador);

    let countdown = document.getElementById("countdown");
    let fondo = document.getElementById("fondo");
    let resultado = document.getElementById("resultado");
    console.log("acabadoo", this.acabao);
    console.log("resultado grande fuera if", resultado);

    if (countdown.innerHTML === " " + 1 + " ") {

      const audio = new Audio('assets/sintiempo.mp3');
      audio.play();
      console.log("ESTAMOS JODIDOS")
      this.puntuacionHTML = 0;
      this.tiempoHTML = "Sin tiempo";
      this.acabao = true;
      console.log("acabadoo dentro  ", this.acabao);
      
      fondo.style.opacity = "1%";
      
      //Swal.fire('GAME OVER', 'Tu tiempo ha expirado', 'error');

      Swal.fire({
        title: 'GAME OVER',
        text: "Tu tiempo ha expirado" ,
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ir a menú principal'
       
      }).then((result) => {
        if (result.value) {
          this.location.back();
          this.location.back();
          //this.irMisJuegos();
        }
      })
      
     
      


      let alumno = new alumnojuegomemorama(localStorage.getItem("alumnoID"), this.juegoDeMemoramaId, this.puntuacionHTML, this.tiempoHTML, this.identificador);
     // console.log("alumno:", alumno);
      //this.dbService.EstablecePuntuacionAlumnoPorID(alumno).subscribe();
    }
    else {

    }
  }

  Puntuacionsintiempo() {

    console.log("ESTAMOS JODIDOS")
    this.puntuacionHTML = 0;
    this.tiempoHTML = "Sin tiempo";

    let alumno = new alumnojuegomemorama(localStorage.getItem("alumnoID"), this.juegoDeMemoramaId, this.puntuacionHTML, this.tiempoHTML, this.identificador);

    this.dbService.EstablecePuntuacionAlumnoPorID(alumno).subscribe();

    console.log("Juego Finalizado: " + this.puntuacionHTML + " Tiempo: " + this.tiempoHTML);
    // tiemporealizado.innerText="FINAL";

    this.damenombre();

    // APARECE EL RESULTADO
    this.acabao = true;

    let fondo = document.getElementById("fondo");
    fondo.style.opacity = "75%";

    let resultado = document.getElementById("resultado");
    resultado.style.animationName = "Expansion";
  }

  irMisJuegos() {

    console.log("MENU JUEGOS");
    this.router.navigate(['/menu-principal'])
      .then(nav => {
        console.log(nav); // true if navigation is successful
      }, err => {
        console.log(err) // when there's an error
      });
  }

  reproducir(nombre: any) {
    if (nombre === 'acierto') {
      const audio = new Audio('assets/acierto.mp3');
      audio.play();
    }
    else if (nombre === 'sintiempo') {
      const audio = new Audio('assets/sintiempo.mp3');
      audio.play();

    }
    else if (nombre === 'error') {
      const audio = new Audio('assets/error.mp3');
      audio.play();
    }
    else {
      const audio = new Audio('assets/felicitacion.mp3');
      audio.play();
    }
  }

  async Relacion() {
    this.familiainfo = await this.dbService.Damefondo(this.familiaId).toPromise();
    this.relacion = this.familiainfo[0].relacion;
    console.log("La RELACION:", this.relacion);
  }



  DividirIDcartas(idcartasjuego, separador) {

    var arrayDeCadenas = idcartasjuego.split(separador);
    this.idcartasseparadas = arrayDeCadenas;
    for (var i = 0; i < arrayDeCadenas.length; i++) {
      console.log(arrayDeCadenas[i]);
    }
  }
  async DameLasCartasDelAlumno() {

    for (let i = 0; this.idcartasseparadas.length > i; i++) {

      let carta = await this.dbService.DamecartasdelafamiliaporID(this.familiaId, this.idcartasseparadas[i]).toPromise();

      if (this.relacion === false) {
        console.log("Sin Relacion");
        this.damecartasdelafamilia.push(carta[0]);
        this.damecartasdelafamilia.push(carta[0]);
      }
      else {
        console.log("Con Relacion")
        this.damecartasdelafamilia.push(carta[0]);
      }
    }

    console.log(this.damecartasdelafamilia);

    // this.damecartasdelafamilia2=this.damecartasdelafamilia;

    console.log("damecartasdelafamilia", this.damecartasdelafamilia);
    this.Mezclador();
    this.PreparaImagenesCartasQueTengo();
    this.PreparaFondo();
    this.preparado = true;
    this.tempo = true;
    this.DimensionesTablero();


  }

  async PreparaFondo() {

    console.log("VAMOS A PREPARAR EL FONDOOOO");
    let fondor = document.getElementById("fondo");

    this.fondo = await this.dbService.Damefondo(this.familiaId).toPromise();
    this.Nombreinicial = this.fondo[0].Nombre;
    this.familiaparafondo = URL.ImagenesCartasdetras + this.fondo[0].ImagenFamilia;
    console.log("FONDOOOOOOOO:", this.fondo[0], this.familiaparafondo);

    fondor.style.backgroundImage = "url('" + this.familiaparafondo + "')";


  }






  tiempo() {

    this.tiempoinicial = this.tiempoduracion;
    let coutdownEl = document.getElementById("countdown");
    this.tempo = true;


    let tiempoinicial = this.tiempoduracion;

    var longitud = this.Cartaspartedetras.length;

    var puntosposibles = this.puntosposibles;
    var posit = Number(document.getElementById("item3").innerText);


    setInterval(updatecountdown, 1000);



    function updatecountdown(valor: any) {



      valor = Number(document.getElementById("item3").innerText);
      coutdownEl.innerHTML = " " + tiempoinicial + " ";
      let temporizador = document.getElementById("countdown");
      let tablero = document.getElementById("tablero");

      if (tiempoinicial > 0) {

        tiempoinicial--;


        if (tiempoinicial < 10) {

          temporizador.style.animationName = "temporizador";
          tablero.style.animationName = "color";

          for (let i = 0; longitud > i; i++) {

            let carta = document.getElementById("tarjeta" + i);

            if (carta.style.transform === "rotateY(180deg)") { }

            else {
              carta.style.animationName = "tarjetasmovimiento";
            }

          }
        }

        if (valor === puntosposibles) {

          tiempoinicial = 0;
          let resultado = document.getElementById("resultado");
          resultado.style.opacity = "99%";
          resultado.style.animationName = "Expansion";

        }
      }

      else {
        coutdownEl.innerHTML = "FINAL";
      }

    }




    // if((minutos>=0)&&(segundos>=0)){

    //   // console.log("VAMOS A VER LOS PUNTICOOOOS",valor,puntosposibles);

    //   if((minutos==0)&&(segundos==10)){

    //     let crono = document.getElementById("countdown");
    //     crono.style.animationName="temporizador";

    //     let tablero = document.getElementById("tablero");
    //     tablero.style.animationName="color";


    //     for(let i=0;longitud>i;i++){

    //     let tarjetas= document.getElementById("tarjeta"+i);

    //     if (tarjetas.style.transform === "rotateY(180deg)"){}

    //     else{
    //       tarjetas.style.animationName="tarjetasmovimiento";
    //       }

    //     }
    //   }

    //   if(valor === puntosposibles){

    //     tiempo=0;
    //     let resultado = document.getElementById("resultado");
    //     resultado.style.opacity="99%";
    //     resultado.style.animationName="Expansion";

    //   }


    //   tiempo--;
    // }

    // else{ 
    //   coutdownEl.innerHTML="FINAL";

    // }

  }












  DimensionesTablero() {

    let tablero = document.getElementById("tablero");
    let title = document.getElementById("Title");
    let contador = document.getElementById("puntuacion");
    let reloj = document.getElementById("countdown");
    let ayuda = document.getElementById("ayuda");
    


    if (this.dificultad === "media") {
      console.log("Estamos en MEDIA");
      tablero.style.gridTemplateColumns = "auto auto auto auto auto";
      for (let i = 0; 10 > i; i++) {

        // console.log("ENTRO EN LA POSICIÓN ",i);

        
        
        let imagendel = document.getElementById("CARTADELANTE" + i);

        
        
        imagendel.style.height = "210px";

      }
    }
    else if (this.dificultad === "facil") {
      console.log("Estamos en FACIL");
      tablero.style.gridTemplateColumns = "auto auto auto auto";
      reloj.style.marginLeft="300px";
      ayuda.style.marginLeft="535px";
      contador.style.width="25%";
      reloj.style.width="17%";
      for (let i = 0; 8 > i; i++) {

        // console.log("ENTRO EN LA POSICIÓN ",i);

        
        
        let imagendel = document.getElementById("CARTADELANTE" + i);

        
        
        imagendel.style.height = "210px";

      }
    }

    else {

      console.log("Estamos en DIFICIL");


      
      tablero.style.rowGap = "8px";
      tablero.style.columnGap="8px";
      tablero.style.gridTemplateColumns = "auto auto auto auto";

      
      reloj.style.marginLeft="295px";
      reloj.style.width="16%";
      ayuda.style.marginLeft="515px";
      contador.style.width="22%";
      


      for (let i = 0; 12 > i; i++) {

        // console.log("ENTRO EN LA POSICIÓN ",i);

        let areatarjetas = document.getElementById("areatarjeta" + i);
        let cartas = document.getElementById("tarjeta" + i);
        let cartassup = document.getElementById("carasuperior" + i);
        let caratras = document.getElementById("trasera" + i);
        let imagentras = document.getElementById("CARTAATRAS" + i);
        let imagendel = document.getElementById("CARTADELANTE" + i);

        areatarjetas.style.width = "155px";
        areatarjetas.style.height = "175px";
        cartas.style.width = "155px";
        cartas.style.height = "175px";
        cartassup.style.width = "155px";
        cartassup.style.height = "175px";
        caratras.style.width = "155px";
        caratras.style.height = "175px";
        imagentras.style.width = "155px";
        imagentras.style.height = "175px";
        imagendel.style.width = "155px";
        imagendel.style.height = "165px";

      }
    }


  }

  Mezclador() {

    this.damecartasdelafamilia.sort(function () { return Math.random() - 0.5 });
  }

  PreparaImagenesCartasQueTengo() {

    for (let i = 0; i < this.damecartasdelafamilia.length; i++) {

      const elem = this.damecartasdelafamilia[i];

      //LOS METO EN ESTE ARRAY PORQUE EN ELEM ESTA LA INFO DE CADA CARTA
      this.damecartasdelafamilia2.push(elem);
      console.log("VEEEEEECTOOOR",this.damecartasdelafamilia2);

      //PARTE DE ADELANTE
      this.damecartasdelafamilia[i] = URL.ImagenesCartas + elem.imagenDelante;
      //console.log("cartasQueTengoImagenDelante[i]:",this.damecartasdelafamilia[i]);
      // console.log("damecartasdelafamilia2",this.damecartasdelafamilia2);

      //PARTE DE ATRAS
      this.Cartaspartedetras[i] = URL.ImagenesCartas + elem.imagenDetras;
      // this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;

    }

  }


  Ayuda() {
    console.log("USADADPOOO");
    this.botonayudausado=this.botonayudausado+this.puntuacionIncorrecta/2;
    console.log("USADADPOOO",this.botonayudausado);
  
    let tarjeta0 = document.getElementById("tarjeta" + 0);
    let tarjeta3 = document.getElementById("tarjeta" + 3);
    let tarjeta6 = document.getElementById("tarjeta" + 6);
    let tarjeta9 = document.getElementById("tarjeta" + 9);

    this.tarjetasayuda.push(tarjeta0, tarjeta3, tarjeta6, tarjeta9);

    for (let i = 0; this.tarjetasayuda.length > i; i++) {


      if (this.tarjetasayuda[i].style.transform === "rotateY(180deg)") {

        console.log("Ya esta girada nen");

      }
      else {



        this.tarjetasayuda[i].style.transform = "rotateY(180deg)";

        setTimeout(() => {

          this.tarjetasayuda[i].style.transform = "rotateY(0deg)";


        }, 2000);

      }
    }

  }

  async click(i: number) {

    this.entrar++;

    //ESTO SE HACE PARA QUE ENTRE UNA VEZ EN EL TEMPORIZADOR Y NO MULTIPLES
    if (this.entrar <= 1) {
      this.tiempo();
      setInterval(this.contador0, 1000);

    }

    let carta = document.getElementById("tarjeta" + i);
    console.log(carta, i);

    if (carta.style.transform != "rotateY(180deg)") {
      carta.style.transform = "rotateY(180deg)";
      this.selecciones.push(i);
    }
    if (this.selecciones.length == 2) {
      this.cartasescogidas(this.selecciones);
      this.selecciones = [];
    }


  }


  cartasescogidas(seleccionesrecibidas: any[]) {

    let contadorpositivo = document.getElementById("item3");
    console.log(contadorpositivo);
    let contadornegativo = document.getElementById("item4");


    setTimeout(() => {

      let trasera1 = document.getElementById("trasera" + seleccionesrecibidas[0]);
      let trasera2 = document.getElementById("trasera" + seleccionesrecibidas[1]);

      let carta1 = document.getElementById("tarjeta" + seleccionesrecibidas[0]);
      let carta2 = document.getElementById("tarjeta" + seleccionesrecibidas[1]);

      if (this.relacion === false) {

        console.log("Caso sin Relacion");

        if (this.damecartasdelafamilia2[seleccionesrecibidas[0]].Nombre != this.damecartasdelafamilia2[seleccionesrecibidas[1]].Nombre) {

          this.reproducir('error')

          carta1.style.transform = "rotateY(0deg)";
          carta2.style.transform = "rotateY(0deg)";

          this.contadorneg++;
          contadornegativo.innerHTML = this.contadorneg + "";
        }

        else {

          this.reproducir('acierto');
          trasera1.style.backgroundColor = "green"
          trasera2.style.backgroundColor = "green"



          this.contadorpos++;
          contadorpositivo.innerHTML = this.contadorpos + "";
          console.log(this.contadorpos);



        }

      }

      else {

        console.log("Caso con RELACION");

        if (this.damecartasdelafamilia2[seleccionesrecibidas[0]].relacion == this.damecartasdelafamilia2[seleccionesrecibidas[1]].id) {

          this.reproducir('acierto')

          trasera1.style.backgroundColor = "green";
          trasera2.style.backgroundColor = "green";


          this.contadorpos++;
          contadorpositivo.innerHTML = this.contadorpos + "";
          console.log(this.contadorpos);


        }

        else {

          this.reproducir('error')
          carta1.style.transform = "rotateY(0deg)";
          carta2.style.transform = "rotateY(0deg)";

          this.contadorneg++;
          contadornegativo.innerHTML = this.contadorneg + "";
        }
      }

      if (this.contadorpos == this.puntosposibles) {



        let tablero = document.getElementById("tablero");
        tablero.style.backgroundColor = "green";

        let tiemporealizado = document.getElementById("countdown");
        let time;

        time = tiemporealizado.innerText;

        // CAMBIAR A TIEMPO REALIZADO

        Number(time);
        console.log("TIEMPOO AAAA NUMEEROOOO", time, Number(time), this.tiempoduracion - Number(time));

        this.tiempoduracion - Number(time)

        let puntuacion;
        puntuacion = (this.contadorpos * this.puntuacionCorrecta) - (this.contadorneg * this.puntuacionIncorrecta);
        console.log("PUNTUAAAAACIOONESSS",puntuacion, time,this.botonayudausado);

        this.puntuacionHTML = puntuacion-this.botonayudausado;
        let tiempofinal = this.tiempoduracion - Number(time);
        this.tiempoHTML = tiempofinal;

        let alumno = new alumnojuegomemorama(localStorage.getItem("alumnoID"), this.juegoDeMemoramaId, puntuacion, tiempofinal, this.identificador);

        this.dbService.EstablecePuntuacionAlumnoPorID(alumno).subscribe(alumno => { console.log(alumno) });

        console.log("Juego Finalizado: " + puntuacion + " Tiempo: " + tiempofinal);
        // tiemporealizado.innerText="FINAL";

        this.damenombre();

        // APARECE EL RESULTADO
        this.acabao = true;

        let fondo = document.getElementById("fondo");
        fondo.style.opacity = "75%";

        let resultado = document.getElementById("resultado");
        resultado.style.animationName = "Expansion";


      }

    }, 1000);

  }

  async damenombre() {
    this.elalumno = await this.dbService.dameAlumnoPorId(localStorage.getItem("alumnoID")).toPromise();
    // console.log(this.elalumno);
    this.nombrealumno = this.elalumno.Nombre;

  }
}
