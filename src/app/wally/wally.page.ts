import { LeadingComment } from '@angular/compiler';
import { Component, OnInit, } from '@angular/core';
import { NumericValueAccessor } from '@ionic/angular';
import { Button } from 'selenium-webdriver';

@Component({
  selector: 'app-wally',
  templateUrl: './wally.page.html',
  styleUrls: ['./wally.page.scss'],
})
export class WallyPage implements OnInit {

  constructor() { }

  
  text:string;
   
  ngOnInit() {

    console.log("HOLA");

  }
}

  //////////////////////////////////////////////////////////////////////////////WALLYYYYYYYYY
    
    const botonmovimiento=document.getElementById('butonmove');
    var pElement = document.getElementById("text");
    var contador=0;


    botonmovimiento.onclick=
    
    function(){
     
      let multipl = 25*Math.random();
      // botonmovimiento.classList.add('ey');
      botonmovimiento.style.marginLeft= multipl+"%";
      botonmovimiento.style.marginRight= multipl+"%";
      botonmovimiento.style.marginTop= multipl+"%";

      contador++;
      pElement.innerHTML = contador+"";
      

    
    }

  //////////////////////////////////////////////////////////////////////////////WALLYYYYYYYYY


  


