import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuentos-a-espiar',
  templateUrl: './cuentos-a-espiar.page.html',
  styleUrls: ['./cuentos-a-espiar.page.scss'],
})
export class CuentosAEspiarPage implements OnInit {

  listaJuegoAlumnosCuentos: any = [];
  listaCuentos: any = [];


  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){

    this.obtenerAlumnosJuegoCuento();

  }



  obtenerAlumnosJuegoCuento() {
    this.dBservice.DameAlumnosJuegoCuento(localStorage.getItem("idJuego"))
      .subscribe(res => {

        this.listaJuegoAlumnosCuentos = res;

        console.log(this.listaJuegoAlumnosCuentos);
        var i = 0;

        this.listaJuegoAlumnosCuentos.forEach(element => {

          this.getCuento(element);
        

        });
      });
  }

  getCuento(element) {
    this.dBservice.dameCuento(element.id)
      .subscribe((res) => {

        if (res.length != 0 && res[0].idAlumno!=localStorage.getItem("idAlumnoJuego")) {
          this.listaCuentos.push(res[0]);
        }
      }, (err) => {

      })
  }

  irMenuPrincipal(){
    this.listaCuentos = [];
    this.router.navigate(['/inicio'])
  }

  irVisorCuento(contenedor){

    this.listaCuentos = [];
    localStorage.setItem("contenedor",contenedor);
    localStorage.setItem("espiando","true");
    this.router.navigate(['/visor-de-escenas'])


  }





}
