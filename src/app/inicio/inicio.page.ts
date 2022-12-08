import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI';
import { AlertController, NavController } from '@ionic/angular';
import { Alumnojuegodecuento } from '../clases/Alumnojuegodecuento';
import { Router } from '@angular/router';
import { LifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  alumnoJuegoDeLibro: any;
  nivel1;
  nivel2;
  nivel3;
  listaDeLibrosAlumnoJuego: any[] = [];
  seleccionado: boolean[];
  cuentoCreado: boolean;


  constructor(
    private router: Router,
    private dBservice: DbServiceService ,
    public alertController: AlertController
  )
  { }

  ngOnInit() {

   
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter Inicio entra');
    this.obtenemosAlumnoJuegoCuento();
    this.obtenemosCuentoAlumnoJuego();
 }

  /**
   * Pedimos la informacion del alumno juego de cuento
   */
  obtenemosAlumnoJuegoCuento()
  {
    this.dBservice.dameAlumnoJuegoCuento(localStorage.getItem("idAlumnoJuego")) //creo que lo que hace es crear una variable con el nombre que sea
    .subscribe(res => {                                                         // Y la deja almacenada ahi para poder pasar ese valor entre pages
      console.log(res);
      this.alumnoJuegoDeLibro=res;
      console.log(res.Nombre);
      console.log(res.id);
      console.log(res.juegoId);
      localStorage.setItem("idAlumnoJuego", res.id);
      localStorage.setItem("idJuego",res.juegoId);
      localStorage.setItem("nivel1",res.nivel1);
      localStorage.setItem("nivel2",res.nivel2);
      localStorage.setItem("nivel3",res.nivel3);

    });

    
  }


 

  /**
   * Obtenemos el cuento del alumno
   */
  obtenemosCuentoAlumnoJuego()
  {
    this.cuentoCreado=false;
    this.dBservice.dameCuentosAlumnoJuego(localStorage.getItem("idAlumnoJuego")).subscribe(res => {
      
     // this.crearCarpeta(res.id);
     if(res.length>0) this.cuentoCreado=true;
      this.listaDeLibrosAlumnoJuego = res
      console.log("yA HA LLEGADO");
      console.log(this.listaDeLibrosAlumnoJuego);
      this.seleccionado = Array(this.listaDeLibrosAlumnoJuego.length).fill(false);
      
    });

  }

  /**
   * Vamos a la pantalla menu-libro del cuento seleccionado
   */
  irCuento(){
    let count: boolean;
    count = false;
  
    console.log(this.seleccionado);

      for(var i = 0; i < this.seleccionado.length; i++)
      {
        if(this.seleccionado[i])
        {
          localStorage.setItem("idLibroDelAlumno",this.listaDeLibrosAlumnoJuego[i].id);
          localStorage.setItem("contenedor",this.listaDeLibrosAlumnoJuego[i].titulo);
          count = true;
          //this.router.navigate(['/menu-libro']);
        }
      }

      if(count) {
        localStorage.setItem("espiando","false");
        this.router.navigate(['/menu-libro']);

      }

  }

  /**
   * Vamos a la pantalla cuentos-a-espiar del alumno
   */
  irEspiarCuentos(){
    console.log(this.alumnoJuegoDeLibro.permisoparaver)
    if(this.alumnoJuegoDeLibro.permisoparaver)
    this.router.navigate(['/cuentos-a-espiar']);
    else this.alertaNoTienesPermisoParaEspiar();
    
  }

  /**
   * Volvemos a la pantalla mi-juegos del alumno
   */
  irMisJuegos()
  {
    this.router.navigate(['/mis-juegos']);
  }

  /**
  * Esta función nos lleva al html de formulario-libro
  */
  public crearCuento() {

    if(this.cuentoCreado) this.alertaCuentoYaCreado();    
    else this.router.navigate(['/formulario-libro']);

  }

  /**
   * Alerta que avisa al alumno que no tiene el privilegio de poder espiar cuentos de otros alumnos
   */
  async alertaNoTienesPermisoParaEspiar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No tienes permiso para espiar!!',
      //subHeader: 'El nombre ya está ocupado',
      message: 'Necesitas el permiso para poder espiar',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  /**
   * Avisa al alumno ya que tiene un cuento creado
   */
  async alertaCuentoYaCreado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cuento ya creado!!',
      //subHeader: 'El nombre ya está ocupado',
      message: 'Solo puedes crear un cuento por juego',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  /**
   * Avisa al alumno de los criterios establecidos por el profesor para poder conseguir los privilegios
   */
  async alertaCriteriosDeCuento() {
    this.dBservice.dameJuegosDelAlumno(localStorage.getItem("idJuego"))
    .subscribe(async res =>{
     
      const alert =  this.alertController.create({
        header: 'Criterio1: ' + res.criterioprivilegio1,

        subHeader: 'Criterio2: ' + res.criterioprivilegio2 ,
        message: 'Criterio3: ' +  res.criterioprivilegio3,
        
       
       // message: 'Criterio3 : ' + res.criterioprivilegio3,
        buttons: ['Aceptar']
      });
       (await alert).present();

    });

    
  }
  



}
