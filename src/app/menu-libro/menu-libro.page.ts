import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-libro',
  templateUrl: './menu-libro.page.html',
  styleUrls: ['./menu-libro.page.scss'],
})
export class MenuLibroPage implements OnInit {

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
    console.log("Entramos a menuLibro")
  }

  /**
   * Vamos al visor de escenas como espias
   */
  public irVisorEscenas() {
    this.router.navigate(['/visor-de-escenas']);
  }

  /**
   * Vamos a la pantalla home para crear una escena
   */
  public irCuento(){
    this.router.navigate(['/home']);
  }
  
  /**
  * Volvemos a la pantalla inicio
  */
  public Atras() {
    this.router.navigate(['/inicio']);
  }

}
