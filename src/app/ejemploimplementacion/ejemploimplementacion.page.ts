import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ejemploimplementacion',
  templateUrl: './ejemploimplementacion.page.html',
  styleUrls: ['./ejemploimplementacion.page.scss'],
})
export class EjemploimplementacionPage implements OnInit {

  constructor() { }

  contador:any;
  
  ngOnInit() {

    console.log("Iniciamos");

  }

  click(){
    console.log("voy a cambiar a verde");
    let boton = document.getElementById("boton");
    boton.style.color="green";
  }

}
