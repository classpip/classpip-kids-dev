import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nombre: string;
  pass: string;


  constructor(
    private router: Router,
    private dBservice: DbServiceService,
    public loadingController: LoadingController,
    public alertController: AlertController
  )    
  { }

  ngOnInit() {
    console.log("LOGIN");
  }


  /**
   * Comrprueba que se han introducido bien el usuario y contraseño
   * Si va bien, el alumno avanza a la pantalla menu-principal
   * Si va mal, aparece una alerta indicandolo
   */
  Autentificar () {
    
    this.dBservice.loginAlumno(this.nombre, this.pass)
    .subscribe ( persona => {

      if (persona.length != 0){

        
        console.log("si");
        console.log(persona);
        localStorage.setItem("alumnoID", persona[0].id)
        this.router.navigate(['/menu-principal']);

      }
      else {
        this.alertaConttraseñaIncorrecta()
        console.log("no");
      }


                             /* if (persona != null) {
                                if (persona.rol === 'Profesor') {
                                    window.location.href = '/profesor';
                                } else {
                                    window.location.href = '/alumno/' + persona.nombre;
                                }
                              }*/

                            }
                );

  }


  /**
   * Pantalla de carga mientras se esta haciendo la consulta a la base de datos
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Verificando Usuario',
      duration: 1500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  /**
   * Alerta que se activa cuando los datos(usuario/contraseña) introducidos por el alumno son incorrectos
   */
  async alertaConttraseñaIncorrecta() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Contraseña incorrecta',
      buttons: ['OK']
    });

    await alert.present();
  }





}
