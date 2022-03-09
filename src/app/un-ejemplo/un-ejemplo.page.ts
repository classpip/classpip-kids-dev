import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-un-ejemplo',
  templateUrl: './un-ejemplo.page.html',
  styleUrls: ['./un-ejemplo.page.scss'],
})
export class UnEjemploPage implements OnInit {

  constructor() { }

  ngOnInit() {}

  cambiartamano(){

    console.log("Voy a cambiar el tamaño");

    let boton = document.getElementById("boton");

    boton.style.width="195px";
    boton.style.height="105px";
  }
}
