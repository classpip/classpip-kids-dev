import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../Servicios/peticionesAPI';
import * as URL from '../URLS/urls';



@Component({
  selector: 'app-memoramagame',
  templateUrl: './memoramagame.page.html',
  styleUrls: ['./memoramagame.page.scss'],
})
export class MemoramagamePage implements OnInit {

  constructor(
    private  dbService:DbServiceService

  ){}

  /////// VARIABLES
  juegoDeMemoramaId:any;
  familiaId:any;
  damecartasdelafamilia: any[]=[];
  damecartasdelafamilia2: any[]=[];
  Cartaspartedetras: any[]=[];
  preparado=false;
  Objeto:any;
  posicion:any;

  posicioncarta1:any;
  posicioncarta2:any;
  carta1:any;
  carta2:any;

  cartasacertadas: any[]=[];
  contador=0;


  /////// VARIABLES

  ngOnInit() {
    console.log("NgonInit");
    // RECOJO LAS VARIABLES juegoDeMemoramaId y la familiaId
    this.juegoDeMemoramaId=localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");

    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId,"familiaId:",this.familiaId);

    // Pido las cartas del Alumno
    this.DameLasCartasDelafamilia();
  }





  DameLasCartasDelafamilia() {

    this.dbService.Damecartasdelafamilia(this.familiaId)
    .subscribe(Cartas =>{
                        for(let i=0;Cartas.length>i;i++)
                        {
                          //Las pusheo 2 veces para hacer las parejas
                          this.damecartasdelafamilia.push(Cartas[i]);
                          this.damecartasdelafamilia.push(Cartas[i]);
  
                        }
                          
                         //console.log("damecartasdelafamilia",this.damecartasdelafamilia);
                          this.MezclarArray();
                          this.PreparaImagenesCartasQueTengo();
                          // Con esta variable hacemos que cargue el HTML
                          this.preparado = true;
  
  
                         
    })
  
  }
  MezclarArray(){

    //Mini funcion para mezclar las cartas y que no salgan una detras de otra
    this.damecartasdelafamilia.sort(function(){return Math.random()-0.5});
  
  }

  PreparaImagenesCartasQueTengo() {

    for (let i = 0; i < this.damecartasdelafamilia.length; i++) {
      
      const elem = this.damecartasdelafamilia[i];
      
      //LOS METO EN ESTE ARRAY PORQUE EN ELEM ESTA LA INFO DE CADA CARTA 
      this.damecartasdelafamilia2.push(elem);
  
      //PARTE DE ADELANTE
      this.damecartasdelafamilia[i] = URL.ImagenesCartas + elem.imagenDelante;
  
      //PARTE DE ATRAS
      this.Cartaspartedetras[i]=URL.ImagenesCartasdetras + elem.imagenDetras;
      // this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
      
    }
  
    console.log("CARTAS DE LA FAMILIA",this.damecartasdelafamilia);
    console.log("CARTAS DE LA FAMILIA2",this.damecartasdelafamilia2);

    console.log("Cartapartedetras:",this.Cartaspartedetras);
  
    
  }
  
  click(e:any){

    this.posicion= e;
    this.Objeto= this.damecartasdelafamilia2[e].Nombre;
  
     console.log("Posicion:",e,"Animal:",this.Objeto);
     console.log(this.damecartasdelafamilia2[e].Nombre);
    
   
    this.posicion=e;
  
    if(this.carta1 === undefined)
    {
       this.carta1=this.damecartasdelafamilia2[e];
       this.posicioncarta1=e;
        console.log("Carta1:",this.carta1,"Posicion:",this.posicioncarta1);
    }
  
    else if(this.carta2 === undefined)
    {
       this.carta2=this.damecartasdelafamilia2[e];
       this.posicioncarta2=e;
        console.log("Carta2:",this.carta2,"Posicion:",this.posicioncarta2);
    }
  
    else{
      console.log("Ya tenemos las dos cartas guardaas");
    }
  
    // console.log("Carta 1:",this.carta1);
    // console.log("Carta2 :",this.carta2);
  
    if(this.carta1 != undefined && this.carta2 !=undefined ){
            console.log("Vamos al lío");
         
              if (this.carta1.id === this.carta2.id){
              this.contador++;
              console.log("Punto");
            
              let contador = document.getElementById("contador");
              contador.innerHTML=this.contador+"";



              this.cartasacertadas.push(this.carta1.id);
              
              //LIMPIAMOS
              this.carta1=undefined;
              this.carta2=undefined;
              console.log(this.carta1,this.carta2);
              this.Cartaspartedetras[this.posicioncarta1]=this.damecartasdelafamilia[this.posicioncarta1];
              this.Cartaspartedetras[this.posicioncarta2]=this.damecartasdelafamilia[this.posicioncarta2];
  
  
  
                      }
            else{
              
              console.log("Has fallado");
              
              //LIMPIAMOS
              this.carta1=undefined;
              this.carta2=undefined;
              console.log(this.carta1,this.carta2);
            }
  
    }
  
  }


}

