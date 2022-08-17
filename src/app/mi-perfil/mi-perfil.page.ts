import { Component, OnInit } from '@angular/core';
import{Router} from'@angular/router';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  perfil: any;

  contrasenaRep: string;
  cambio = false;
  cambioPass = false;


  constructor(private router: Router, private dBservice: DbServiceService, public alertController: AlertController,public actionSheetController: ActionSheetController) { }

   ngOnInit() {

  }
  
  async ionViewWillEnter()
  {

    console.log("Entramos al Perfil");
    this.perfil = await this.dBservice.dameAlumnoPorId(localStorage.getItem("alumnoID")).toPromise();


  }

  /**
   * Va a la pantalla menu principal
   */
  irMenuPrincipal()
  {
    this.cambio=false;
    this.cambioPass=false;
    this.router.navigate(['/menu-principal'])
  }

  /**
   * Comprueba que el email sea correcto
   * @param email email del alumno
   * @returns devuelve el email testeado
   */
  EmailCorrecto(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  /**
   * Permite al alumno cambiar los datos del alumno
   */
  async CambiarDatos () {


    const confirm = await this.alertController.create({
      header: '¿Seguro que quieres modificar tus datos?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            if (this.cambioPass && (this.perfil.Password !== this.contrasenaRep)) {
              const alert = await this.alertController.create({
                header: 'No coincide la contraseña con la contraseña repetida',
                buttons: ['OK']
              });
              await alert.present();
            } else if (!this.EmailCorrecto (this.perfil.Email)) {
              const alert = await this.alertController.create({
                header: 'El email es incorrecto',
                buttons: ['OK']
              });
              await alert.present();
            } else {
                this.dBservice.ModificaAlumno (this.perfil)
                .subscribe (async () => {
                  const alert = await this.alertController.create({
                    header: 'Datos modificados con éxito',
                    buttons: ['OK']
                  });
                  await alert.present();
                });
            }
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await confirm.present();



  }






}
