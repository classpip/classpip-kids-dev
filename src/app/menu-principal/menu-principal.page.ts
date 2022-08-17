import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
})
export class MenuPrincipalPage implements OnInit {
  

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
     console.log("Estamos en el menu-LOGIN");
  }

  /**
  * Va a la pantalla mis-juegos
  */
  irJuegos(){        
    this.router.navigate(['/mis-juegos']);
  }

  /**
  * Va a la pantalla mi-perfil
  */
  irPerfil(){
    this.router.navigate(['/mi-perfil']);
  }

  /**
  * Va a la pantalla mis-grupos
  */
  irGrupos(){
    this.router.navigate(['/mis-grupos'])
  }

  /**
  * Vuelve a la pantalla login
  */
  atras(){
    this.router.navigate(['/login']);
  }

}
