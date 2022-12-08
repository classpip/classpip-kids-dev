import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI'
import { NgForm } from '@angular/forms';
import{Libro} from '../clases/libro';
import{Alumno} from '../clases/alumno';
import { AlertController, NavController } from '@ionic/angular';
import { Alumnojuegodecuento } from '../clases/Alumnojuegodecuento';

@Component({
  selector: 'app-formulario-libro',
  templateUrl: './formulario-libro.page.html',
  styleUrls: ['./formulario-libro.page.scss'],
})
export class FormularioLibroPage implements OnInit {

    cuento;
    alumno: Alumno;
    idAlumnoJuego;



  constructor(public navCtrl: NavController, private router: Router, private dBservice: DbServiceService , public alertController: AlertController) { }

  ngOnInit() {
    console.log("Entramos a formulario");
    this.Damealumno();
  }

  Damealumno() {
    this.idAlumnoJuego=localStorage.getItem("idAlumnoJuego");
    console.log(this.idAlumnoJuego);

    this.dBservice.dameAlumnoJuego(this.idAlumnoJuego)
      .subscribe(res => {
        
        this.alumno = res;
        console.log("Recibo alumno");
        console.log(this.alumno);
        

      });

  }



  public Atras() {

    //this.router.navigate(['/inicio']);
    this.navCtrl.navigateRoot(['/inicio']);
    

  }


  public crearCuento(form: NgForm) {

    this.cuento = new Libro;
    
      if (form.value.titulo != null) {
        this.cuento.titulo = form.value.titulo;
        console.log("perf");
        console.log(this.cuento.titulo);
      }
      if (form.value.textarea != null) {
        this.cuento.resumen = form.value.textarea;
        console.log(this.cuento.resumen);
      }
      this.cuento.autor = this.alumno.Nombre;
      this.cuento.portada = 'aa';
      this.cuento.idAlumno = this.alumno.id;
      this.cuento.numeropag = '32';
  

      
      this.dBservice.comprobarTituloCuento(this.cuento.titulo)
        .subscribe(res => {
          if(res[0] == null){
          this.publicarCuento();
          }
          else{
            this.alertaNombreIgual();
          }
        });
  
  
    }


    crearCarp() {

      const name = {
        "name": this.cuento.titulo
     }


      this.dBservice.crearCarpeta(name)
         .subscribe((res) =>
            console.log(res),

            (err) => (console.log(err))
         )
   }
    

    public publicarCuento()
    {
      this.idAlumnoJuego=localStorage.getItem("idAlumnoJuego")
  
      this.dBservice.publicarCuento(this.idAlumnoJuego, this.cuento)
        .subscribe(res => {
          console.log(res);
         // this.crearCarpeta(res.id);
         

        });

        this.crearCarp();
        this.router.navigate(['/inicio']);
    }

    async alertaNombreIgual() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'No se ha creado el cuento',
        subHeader: 'El nombre ya está ocupado',
        message: 'Ya existe un libro con este nombre, elije otro',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }






}
