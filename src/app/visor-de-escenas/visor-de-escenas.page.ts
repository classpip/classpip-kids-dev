import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/Servicios/peticionesAPI'
import { Router } from '@angular/router';
import { ImagenToBackend } from '../clases/imagenGuardada';
import{imagenEscena}from '../clases/imagenEscena';

@Component({
  selector: 'app-visor-de-escenas',
  templateUrl: './visor-de-escenas.page.html',
  styleUrls: ['./visor-de-escenas.page.scss'],
})
export class VisorDeEscenasPage implements OnInit {

  constructor(private router: Router, private dBservice: DbServiceService) { }

  listaEscenasVisor: any[] = [];
  listaEscenasVisor2: any[] = [];
  recursoCargadoPregunta: any = false;
  recursoCargado: any;
  x:number;
  espiando: boolean;


	async ngOnInit() {
		if (localStorage.getItem('GoToVisor') == 'true') {
			localStorage.setItem('GoToVisor', 'false');
			window.location.reload();
		}
	}

  async ionViewWillEnter()
  {
    if(localStorage.getItem("espiando")=="true") this.espiando=true;
    else this.espiando=false;

    console.log("lets go")
    await this.obtengoImagenesEscenas();
    await this.traeImagenesRecursoLibro();
    console.log(this.listaEscenasVisor);


  }


/**
 * Obtengo las imagenes de escenas del cuento
 */
 async obtengoImagenesEscenas() {
  this.listaEscenasVisor = await this.dBservice
    .obtenerImagenesEscena(localStorage.getItem('contenedor'))
    .toPromise();

  console.log('llegado');
  console.log(this.listaEscenasVisor);
}

/**
 * Trae las imagenes para poder mostrarlas por el visor de escenas
 */
traeImagenesRecursoLibro(){

this.listaEscenasVisor2 = [];
this.recursoCargadoPregunta = true;
console.log('This');
 
console.log('id: ')

  this.listaEscenasVisor.forEach(async element => {

    let res = await this.dBservice.getEscenasDeRecurso(localStorage.getItem("contenedor"), element.name).toPromise()
  
    const blob = new Blob([res.blob()], { type: 'image/png' });
      const reader = new FileReader();

      reader.addEventListener('load',  () => {
        let elementNombre: string;
        var foto = null;
        foto = reader.result.toString();
        var fotoProps = new ImagenToBackend();
        fotoProps.url = foto;

        elementNombre=element.name;
        element.name=elementNombre.split(".",1);
        fotoProps.nombre = element.name
        this.listaEscenasVisor2.push(fotoProps);
        
        //Se ordenan las escenas, ya que a veces nos llegan desordenadas desde la API
        this.listaEscenasVisor2.sort(function(a,b){
          console.log("wdawdada          "+a.nombre)
          return a.nombre-b.nombre;
        })
        
        console.log("wdawdadad"+ this.listaEscenasVisor2[0].nombre)

      });

      if (blob) {
        reader.readAsDataURL(blob);
      }



  });
  console.log(this.listaEscenasVisor2);
  console.log('end')

}

/**
 * Eliminamos la escena seleccionada
 * @param nombre nombre de la escena
 * @param i posicion en la lista
 */
async eliminarEscena(nombre:string, i:number)
{
  nombre = nombre+".png";
  console.log(nombre);

  if(nombre)
  {
    await this.dBservice.BorraImagenEscena(localStorage.getItem("contenedor"),nombre).toPromise();
    this.listaEscenasVisor2.splice(i,1);
    let res = nombre.split(".", 1);
    await this.dBservice.BorrarElementosDeEscena(res).toPromise();
    await this.dBservice.BorrarEscena(res).toPromise();
    
    console.log("hola")
    //this.router.navigate(['/visor-de-escenas']);  
  }
  else console.log("no hay foto")
  //this.dBservice.BorraImagenEscena(localStorage.getItem("contenedero"),)
}

//Boton para editar una escena
	async editarEscena(nombre: string) {
		let res =nombre;
		console.log('Resultado del splice: ' + res);
		localStorage.setItem('idEditar', '' + res + '');
		localStorage.setItem('modoEditar', 'true');

		this.router.navigate(['/home']);
	}


/**
 * Añade un sleep a la aplicación antes de ejecutar la siguiente linea de codigo
 * @param ms Tiempo en ms que queremos
 * @returns Devuelve el delay
 */
delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * Vuelvo a la pantalla cuentos-a-espiar, ya que habia entrado como espia
 */
AtrasEspia(){

    this.router.navigate(['/cuentos-a-espiar']);

}

/**
 * Vuelvo a la pantalla menu-libro
 */
Atras()
  {
    localStorage.setItem('GoToVisor', 'false');
    this.router.navigate(['/menu-libro']);
  }

}
