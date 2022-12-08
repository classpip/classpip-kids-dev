import { Component } from '@angular/core';
import interact from 'interactjs';
import { DbServiceService } from 'src/app/Servicios/peticionesAPI';
import { ImagenToBackend } from '../clases/imagenGuardada';
import { PersonajesPagina } from '../clases/PersonajesPagina';
import { TextoCuento } from '../clases/TextoCuento';
import { Observable } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { escena } from '../clases/escena';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	private _document: any;

	constructor(
		private dBservice: DbServiceService,
		public alertController: AlertController,
		private router: Router
	) {}

	@ViewChild('canvas', { static: true })
	canvas: ElementRef<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;

	girarImagen = 0;
	value = '';

	modoEditar: any;
	idEditar = '';

	listaFotosPersonajes: any[] = [];
	listaFotosFondos: any[] = [];
	listaFotosObjetos: any[] = [];
	listaFotosDeEscena: any[] = [];
	listaTexto: TextoCuento[] = [];
	listaPersonajesPagina: PersonajesPagina[] = [];
	listaReordenarCanvas: PersonajesPagina[] = [];
	listaModoEdicion: PersonajesPagina[] = [];
	listaRecursos: any[] = [];
	listaElementos: any[] = [];
	recursoId: Number;
	recursoCargadoPregunta: any = false;
	recursoCargado: any;
	personajePagina: PersonajesPagina;
	idEscenaPrueba: Number;
	mark: string;
	prueba34 = -1;
	//Ambas variables utilizadas para declarar el source de los tÃ­tulos Personajes y Objetos en pantalla.
	imagenPersonajes = '';
	imagenObjetos = '';
	deviceCanvasX = 800;
	deviceCanvasY = 500;
	imagenSizeDeInicioWidth = 65;
	imagenSizeDeInicioHeight = 65;
	loadPage = false;

	async ngOnInit() {}

	resX = 0;
	resY = 0;

  //Cada vez que entramos al editor carga esta funcion.
	async ionViewWillEnter() {

		//Miramos si nos encontramos en el modoEditar.
		this.modoEditar = localStorage.getItem('modoEditar');
		this.idEditar = localStorage.getItem('idEditar');

		//Conocemos la resolución del dispositivo desde el que se ejecuta la App
		var resY = window.screen.availHeight;
		var resX = window.screen.availWidth;

		this.resX = resX;
		this.resY = resY;

		//Con esta condicion cambiaremos las dimensiones del canvas
		if (resX <= 1024) {
			this.deviceCanvasX = 690;
			this.deviceCanvasY = 440;
			this.imagenSizeDeInicioHeight = 45;
			this.imagenSizeDeInicioWidth = 45;

			var desplegable = document.getElementById('desplegable');
			var inputs = document.getElementById('inputs');

			desplegable.classList.remove('seleccionaTexto');
			desplegable.classList.add('seleccionaTexto2');

			inputs.classList.remove('seleccionaTexto');
			inputs.classList.add('seleccionaTexto2');
		}

		//Recuperamos la lista de recursos donde se encuentran las imagenes para la app//
		await this.recuperarListaRecursos();
		this.obtengoNumeroEscenas();

		//Cargamos la imagen que vamos a usar para realizar los bocadillos de texto.
		var bocadilloImagen = new Image();
		bocadilloImagen.src = '../../assets/icon/bocadillo.png';
		this.value = bocadilloImagen.src;

		//Cargamos la imagen con el titulo Personajes y lo colocamos en la posicion deseada utilizando el style.
		var Personajes = new Image();
		Personajes.src = '../../assets/icon/Personajes.png';
		this.imagenPersonajes = Personajes.src;
		var imagenPersonaje = document.getElementById(
			'imagenPersonajes'
		) as HTMLImageElement;

		var dataXPersonaje = -25;
		var dataYPersonaje = -25;

		if (resX <= 1024) {
			imagenPersonaje.style.width = '170px';
			imagenPersonaje.style.height = '50px';
			dataXPersonaje = -20;
			dataYPersonaje = -15;
		}

		imagenPersonaje.style.transform =
			'translate(' + dataXPersonaje + 'px, ' + dataYPersonaje + 'px)';
		imagenPersonaje.setAttribute('data-x', '' + dataXPersonaje + '');
		imagenPersonaje.setAttribute('data-y', '' + dataYPersonaje + '');

		//Cargamos la imagen con el titulo Objetos y lo colocamos en la posicion deseada utilizando el style.
		var Objetos = new Image();
		Objetos.src = '../../assets/icon/Objetos.png';
		this.imagenObjetos = Objetos.src;
		var imagenObjeto = document.getElementById(
			'imagenObjetos'
		) as HTMLImageElement;

		var dataXObjeto = 250;
		var dataYObjeto = -25;

		if (resX <= 1024) {
			imagenObjeto.style.width = '130px';
			imagenObjeto.style.height = '50px';
			dataXObjeto = 140;
			dataYObjeto = -15;
		}

		imagenObjeto.style.transform =
			'translate(' + dataXObjeto + 'px, ' + dataYObjeto + 'px)';
		imagenObjeto.setAttribute('data-x', '' + dataXObjeto + '');
		imagenObjeto.setAttribute('data-y', '' + dataYObjeto + '');

		//Traemos las imagenes de mi recurso que hay en la API.
		await this.traeImagenesRecursoLibro().subscribe();

		//Utilizamos la funcion  para esperar la carga completa de mi recurso que hay en la API.
		await this.delay(500);

		//Add en pantalla las imagenes que son objetos.
		console.log('CARGAMOS OBJETOS');
		await this.cargoObjetos();

		//Add en pantalla las imagenes que son personajes.
		await this.cargoPersonajes();
		await this.delay(500);

		//En el caso que entremos en modoEditar cargaremos las siguientes funciones
		if (localStorage.getItem('modoEditar') == 'true') {
			await this.getApiElementos();
			this.recolocar();
		}
	}

	//Copia el texto que ha escrito el usuario y hace un return del texto.
	copiarTexto(markVal: string) {
		markVal = this.mark;
		return markVal;
	}

	//Variables necesarias para cambiar de fondo
	fondoActual = '';
	fondoActualUrl = '';
	posicionFondo = 0;

	ultimoClickSiguiente = false;
	encontradoFondoEdit = false;

	//Funcion encargada de pasar al siguiente fondo de la lista
	siguienteFondo() {
		var longitudListaFondos = this.listaFotosFondos.length;


		this.ultimoClickSiguiente = true;

		if (this.ultimoClickAnterior == true) {
			this.posicionFondo++;
			this.ultimoClickAnterior = false;
		}

		if (this.posicionFondo >= longitudListaFondos) {
			this.posicionFondo = 0;
		}

		if (this.fondoActual == '') {
			console.log('NO HAY FONDO ACTUAL');

			this.fondoRecolocar(this.listaFotosFondos[0].nombre);
			this.seleccionarfondo(this.listaFotosFondos[0].url);

			this.fondoActualUrl = this.listaFotosFondos[0].url;
			this.fondoActual = this.listaFotosFondos[0].nombre;

			this.posicionFondo++;
		} else {
			console.log(
				'SI HAY FONDO ACTUAL ' +
					this.fondoActual +
					' POSICION ' +
					this.posicionFondo
			);

			this.fondoRecolocar(this.listaFotosFondos[this.posicionFondo].nombre);
			this.seleccionarfondo(this.listaFotosFondos[this.posicionFondo].url);

			this.posicionFondo++;
		}
	}

	//Variable necesaria para cambiar al fondo anterior	
	ultimoClickAnterior = false;

	//Funcion para volver al fondo anterior
	anteriorFondo() {
		this.ultimoClickAnterior = true;

		if (this.ultimoClickSiguiente == true) {
			this.posicionFondo--;
			this.ultimoClickSiguiente = false;
		}

		var longitudListaFondos = this.listaFotosFondos.length;

		if (this.posicionFondo == 0) {
			this.posicionFondo = longitudListaFondos - 1;

			this.fondoRecolocar(this.listaFotosFondos[this.posicionFondo].nombre);
			this.seleccionarfondo(this.listaFotosFondos[this.posicionFondo].url);
		} else {
			this.posicionFondo--;

			this.fondoRecolocar(this.listaFotosFondos[this.posicionFondo].nombre);
			this.seleccionarfondo(this.listaFotosFondos[this.posicionFondo].url);
		}
	}

	//Cargo las imagenes que son Personajes para mostrarlos en pantalla.
	async cargoPersonajes() {
		this.listaFotosPersonajes.forEach((element) => {
			var imagenPersonaje = new ImagenToBackend();
			imagenPersonaje = element;
			this.seleccionarobjeto(imagenPersonaje, 'Personaje');
		});
	}

	//Cargo las imagenes que son Objetos para mostrarlos en pantalla.
	async cargoObjetos() {
		this.listaFotosObjetos.forEach(async (element) => {
			console.log(element);
			var imagenPersonaje = new ImagenToBackend();
			imagenPersonaje = element;
			this.seleccionarobjeto(imagenPersonaje, 'Objeto');
		});
	}

	/*Esta variable incrementa en 1 cada vez que se interactua con una imagen
de esta manera podremos saber en que orden del eje Z se deben encontrar las imagenes
*/
	zIndexImagenes = 0;

	/**
	 *
	 * @param objeto Le pasamos la id de la imagen con la que estamos interactuando.
	 * @param event Parametro event para interactuar con eventos.
	 */
	/*Funcion que determina la posiciÃ³n de las imagenes en el eje Z siendo el que estÃ¡ por encima de los demÃ¡s
el Ãºltimo con el que se ha interactuado.

AdemÃ¡s si la imagen se encuentra girada, y te encuentras en el modo resize, con esta funciÃ³n dejamos el angulo de la imagen a 0.
*/
	organizarEjeZ(objeto: any, event) {
		document.getElementById(objeto).classList.add('positionAbsolute');

		document.getElementById(objeto).style.zIndex =
			'' + this.zIndexImagenes + '';
		this.zIndexImagenes = this.zIndexImagenes + 1;

		if (this.resizeAngle == true) {
			var target = event.target;
			target.setAttribute('data-angle', 0);
			var scaleX = target.dataset.scaleX;
			var x = target.dataset.x;
			var y = target.dataset.y;
			this.listaFotosDeEscena.forEach((elemento) => {
				if (elemento.nombre == objeto) {
					scaleX = elemento.invertir;
				}
			});

			target.style.transform =
				'translate(' + x + 'px,' + y + 'px) scaleX(' + scaleX + ')';
		}

		console.log(document.getElementById(objeto));
	}

	/**
	 *
	 * @param objeto Le pasamos la id de la imagen con la que estamos interactuando.
	 * @param event Parametro event para interactuar con eventos.
	 */
	//FunciÃ³n encargada de voltear la imagen, o tambiÃ©n llamado poner la imagen en modo espejo.
	voltearImagen(objeto: any, event) {
		//Recorremos la lista para conocer el estado de la imagen.
		this.listaFotosDeEscena.forEach((obj) => {
			var imagenObjeto = document.getElementById(objeto);
			//Eliminamos el modo resize.
			if (obj.nombre == objeto) {
				document.getElementById(obj.nombre).classList.remove('cajita');
				document.getElementById(obj.nombre).classList.remove('cajitaInvertida');
				document.getElementById(obj.nombre).classList.remove('resize-drag');
			}
			//Cambiamos el style de la imagen para invertirla.
			if (obj.nombre == objeto && obj.invertir == 1) {
				obj.invertir = -1;
				var x = imagenObjeto.dataset.x;
				var y = imagenObjeto.dataset.y;

				if (typeof x != 'undefined' && typeof y != 'undefined') {
					imagenObjeto.style.transform =
						'translate(' + x + 'px, ' + y + 'px) scaleX(-1)';
				} else {
					imagenObjeto.style.transform = 'scaleX(-1)';
				}
			}
			//Cambiamos el style de la imagen para invertirla.
			else if (obj.nombre == objeto && obj.invertir == -1) {
				var x = imagenObjeto.dataset.x;
				var y = imagenObjeto.dataset.y;

				if (typeof x != 'undefined' && typeof y != 'undefined') {
					imagenObjeto.style.transform =
						'translate(' + x + 'px, ' + y + 'px) scaleX(1)';
				} else {
					imagenObjeto.style.transform = 'scaleX(1)';
				}

				obj.invertir = 1;
			}
		});
	}

	//Lista dede la cual subiremos toda la informacion de los objetos y personajes a la API
	listaElementosApi: any[];

	//Subimos a la API toda la informacion de los personajes y objetos.
	subimosAPIElementos() {
		this.listaElementosApi = this.listaPersonajesPagina;

		this.listaElementosApi.forEach((elemento) => {
			elemento.url = '';
			elemento.fondoUrl = '';

			//PUSH A LA API
			this.dBservice
				.postElemento(localStorage.getItem('idEscena'), elemento)
				.subscribe(
					(res) => {
					},
					(err) => {
						console.log('Error al crear escena');
						console.log('Error : ' + err);
					}
				);
		});
	}

	// Funcion encargada de llamar a una alerta para avisar falta de permisos
	async alertaNoTienesPermisoParaEspiar() {
		const alert = await this.alertController.create({
			cssClass: 'my-custom-class',
			header: '¡Has superado el número máximo de páginas!',
			//subHeader: 'El nombre ya está ocupado',
			message: 'Borra alguna página o solicita subir de nivel.',
			buttons: ['Aceptar'],
		});

		await alert.present();
	}

	//Contador utilizado para añadir ID propia por pagina a cada Personaje/Objeto que hay en pantalla.
	contadorIDPersonajes = 0;
	numeroPaginas = 0;

	//Función encargada de pintar todo en el canvas y guardar imagen.
	async crearPagina() {
		var listaEscenasVisor: any[] = [];

		listaEscenasVisor = await this.dBservice
			.obtenerImagenesEscena(localStorage.getItem('contenedor'))
			.toPromise();

		var nivel1 = localStorage.getItem('nivel1');
		var nivel2 = localStorage.getItem('nivel2');
		var modoEditar = localStorage.getItem('modoEditar');

		if (nivel2 == 'true') {
			console.log('Puedes crear ilimitadas páginas');
		} else if (nivel1 == 'true' && modoEditar == 'false') {
			if (listaEscenasVisor.length == 4) {
				this.alertaNoTienesPermisoParaEspiar();
				console.log('Número máximo de escenas creadas');
				return;
			} else {
				console.log('Puedes seguir creando escenas');
			}
		} else {
			if (listaEscenasVisor.length == 3 && modoEditar == 'false') {
				this.alertaNoTienesPermisoParaEspiar();
				console.log('Número máximo de escenas creadas');
				return;
			} else {
				console.log('Puedes seguir creando escenas');
			}
		}

		let res = await this.dBservice
			.postEscena(localStorage.getItem('idLibroDelAlumno'), new escena())
			.toPromise();
		localStorage.setItem('idEscena', res.id);

		//Recorremos la lista encargada de mostrar los Personajes/Objetos en pantalla.
		this.listaFotosDeEscena.forEach((obj) => {
			//Por cada personaje/objeto que hay en la lista, creamos un nuevo personaje/objeto
			var imagendeEscena = new PersonajesPagina();

			imagendeEscena.personajeID = this.contadorIDPersonajes;
			this.contadorIDPersonajes = this.contadorIDPersonajes + 1;
			imagendeEscena.nombre = obj.nombre;
			//Por cada personaje/objeto guardamos su información en el elemento creado previamente.
			var imagenObjeto = document.getElementById(
				obj.nombre
			) as HTMLImageElement & HTMLCanvasElement;
			imagendeEscena.imagenWidth = imagenObjeto.width;
			imagendeEscena.imagenHeight = imagenObjeto.height;
			imagendeEscena.invertir = obj.invertir;
			imagendeEscena.rotate =
				parseFloat(imagenObjeto.getAttribute('data-angle')) || 0;
			imagendeEscena.zindex = imagenObjeto.style.zIndex.valueOf();
			imagendeEscena.canvasX = imagenObjeto.getBoundingClientRect().left;
			imagendeEscena.canvasY = imagenObjeto.getBoundingClientRect().top;
			//Guardamos también el fondo en el que se encuentra el personaje/objeto
			imagendeEscena.fondoUrl = this.fondoRecolocarEdit;
			imagendeEscena.imagenDataX = parseFloat(
				imagenObjeto.getAttribute('data-x')
			);
			imagendeEscena.imagenDataY = parseFloat(
				imagenObjeto.getAttribute('data-y')
			);
			imagendeEscena.especial = obj.especial;
			imagendeEscena.id = obj.id;
			imagendeEscena.tipo = obj.tipo;
			imagendeEscena.url = obj.url;
			imagendeEscena.positionlista = obj.positionlista;
			imagendeEscena.translate = imagenObjeto.getAttribute('style');

			//Añadimos cada personaje/objeto a la lista
			this.listaPersonajesPagina.push(imagendeEscena);
		});

		/*
		Vaciamos la lista que muestras los Personajes/Objetos, para asÃ­
		poder reordenar los Personajes/Objetos en pantalla
		*/
		this.listaFotosDeEscena = [];

		/*
		VacÃ­amos los contadores de ID independientes por pÃ¡gina, tanto
		de personajes/objetos como de texto.
		*/
		this.contadorTexto = 0;
		this.contadorIDPersonajes = 0;

		//llamamos a las funciones encargadas de pintar el canvas
		this.drawCanvas();

		this.listaPersonajesPagina.forEach(async (elemento) => {
			elemento.url = '';

			if (localStorage.getItem('modoEditar') == 'true') {
				await this.dBservice.BorrarElementosDeEscena(this.idEditar).toPromise();
				let res = this.dBservice
					.postElemento(localStorage.getItem('idEditar'), elemento)
					.toPromise();
			} else {
				let res = this.dBservice
					.postElemento(localStorage.getItem('idEscena'), elemento)
					.toPromise();
			}
		});
		this.listaPersonajesPagina = [];

		this.pruebaCanvasUrl();

		//AÃ±adimos un  para darle tiempo a leer todo el cÃ³digo
		await this.delay(50);

		//Reiniciamos los contadores encargardos de recolocar los Personajes/objetos en pantalla
		this.contadorColocadorObjetoX = 0;
		this.contadorColocadorObjetoY = 1;
		this.contadorColocadorPersonajeX = 0;
		this.contadorColocadorPersonajeY = 1;

		//Volvemos a cargar los personajes/objetos para mostrarlos en pantalla
		this.cargoObjetos();
		this.cargoPersonajes();

		//Limpiamos el canvas dejandolo en blanco
		this.ctx.clearRect(0, 0, 1000, 500);

		//Vaciamos el fondoElegido
		this.fondoElegido = '';

		//Vaciamos la lista de texto
		this.listaTexto.forEach((texto) => {
			this.removeTexto(texto.textoID);
		});

		localStorage.setItem('modoEditar', 'false');
	}

	listaEscenasVisor: any[] = [];
	listaEscenasVisor2: any[] = [];
	async cambiarNombreFicheroImagen() {
		this.listaEscenasVisor = await this.dBservice
			.obtenerImagenesEscena(localStorage.getItem('contenedor'))
			.toPromise();

		console.log('llegado');
		console.log(this.listaEscenasVisor);

		this.recursoCargadoPregunta = true;
		console.log('This');

		console.log('id: ');

		this.listaEscenasVisor.forEach(async (element) => {
			let res = await this.dBservice
				.getEscenasDeRecurso(localStorage.getItem('contenedor'), element.name)
				.toPromise();

			const blob = new Blob([res.blob()], { type: 'image/png' });
			const reader = new FileReader();

			reader.addEventListener('load', () => {
				var foto = null;
				foto = reader.result.toString();
				var fotoProps = new ImagenToBackend();
				fotoProps.url = foto;

				fotoProps.nombre = element.name;

				this.listaEscenasVisor2.push(fotoProps);
			});

			if (blob) {
				reader.readAsDataURL(blob);
			}
		});

		console.log(this.listaEscenasVisor2);
		console.log(this.listaEscenasVisor2.length);

		console.log('end');
	}

	/*
	Las siguientes funciones se encargan de convertir el canvas en URL.
	Convertirla en imagen.
	Asignarle el numero por orden de creacion de pagina, asi como la pagina si es una pagina editada
	Subir la imagen en una carpeta a la API
	*/
	async pruebaCanvasUrl() {
		const formData: FormData = new FormData();
		var micanvas = document.getElementById('canvas') as HTMLCanvasElement;
		var dataURL = micanvas.toDataURL();
		if (localStorage.getItem('modoEditar') == 'false') {
			var file = this.dataURLtoFile(
				dataURL,
				localStorage.getItem('idEscena') + '.png'
			);
		} else {
			var file = this.dataURLtoFile(
				dataURL,
				localStorage.getItem('idEditar') + '.png'
			);
		}
		this.numeroPaginas++;

		formData.append('fotoFrame', file);

		await this.postFotoFrame(formData);
	}

	async postFotoFrame(formData: FormData) {
		var contenedor = localStorage.getItem('contenedor');

		if (localStorage.getItem('modoEditar') == 'false') {
			this.dBservice.postImage(contenedor, formData).toPromise();
			console.log('ok');
		} else {
			let nombre = this.idEditar + '.png';
			await this.dBservice
				.BorraImagenEscena(localStorage.getItem('contenedor'), nombre)
				.toPromise();
			await this.dBservice.postImage(contenedor, formData).toPromise();
		}
	}

	dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	async obtengoNumeroEscenas() {
		let res = await this.dBservice
			.obtenerImagenesEscena(localStorage.getItem('contenedor'))
			.toPromise();

		this.numeroPaginas = res.length;
		console.log(this.numeroPaginas);
	}

	/*
	Funcion que nos ayuda a organizar la lista de elementos.
	De esta manera sabremos el orden en el que hay que pintar los elementos
	y conocer que elemento está encima de otro.
	*/
	compararEjeZ(a, b) {
		if (a.zindex < b.zindex) {
			return -1;
		}
		if (a.zindex > b.zindex) {
			return 1;
		}
		return 0;
	}

	//Funcion encargada de pintar todos los elementos en el canvas de la misma manera que los ha colocado el usuario.
	drawCanvas() {
		//Primero dibujamos el fondo
		this.seleccionarfondo(this.fondoElegido);

		this.listaTexto.forEach((texto) => {
			var Texto = new Image();

			Texto.src = this.value;

			this.ctx.drawImage(
				Texto,
				texto.imagenX,
				texto.imagenY,
				texto.imagenWidth,
				texto.imagenHeight
			);

			this.ctx.fillText(texto.textoString, texto.textoX, texto.textoY);
		});

		this.listaPersonajesPagina.sort(this.compararEjeZ);
		this.listaReordenarCanvas = this.listaPersonajesPagina;
		this.listaModoEdicion = this.listaPersonajesPagina;
		var Imagen = new Image();
		var angle = 0;
		this.listaReordenarCanvas.forEach((objeto) => {
			angle = objeto.rotate * (180 / Math.PI);
			Imagen.src = objeto.url;

			this.ctx = this.canvas.nativeElement.getContext('2d');

			if (objeto.invertir == -1 && objeto.rotate == 0) {
				this.ctx.save();
				this.ctx.translate(objeto.canvasX + objeto.imagenWidth / 2, 0);
				this.ctx.scale(-1, 1);

				this.ctx.drawImage(
					Imagen,
					-objeto.imagenWidth / 2,
					objeto.canvasY,
					objeto.imagenWidth,
					objeto.imagenHeight
				);
				this.ctx.restore();
			} else if (objeto.invertir == 1 && objeto.rotate == 0) {
				this.ctx.save();

				this.ctx.drawImage(
					Imagen,
					objeto.canvasX,
					objeto.canvasY,
					objeto.imagenWidth,
					objeto.imagenHeight
				);

				this.ctx.restore();
			} else if (objeto.invertir == 1 && objeto.rotate != 0) {
				this.ctx.save();

				this.ctx.translate(
					objeto.canvasX + objeto.imagenWidth / 2,
					objeto.canvasY + objeto.imagenHeight / 2
				);
				this.ctx.rotate(objeto.rotate);
				this.ctx.translate(-objeto.imagenWidth / 2, -objeto.imagenHeight / 2);
				this.ctx.drawImage(
					Imagen,
					0,
					0,
					objeto.imagenWidth,
					objeto.imagenHeight
				);

				this.ctx.restore();
			} else if (objeto.invertir == -1 && objeto.rotate != 0) {
				this.ctx.save();

				this.ctx.translate(
					objeto.canvasX + objeto.imagenWidth / 2 + 18,
					objeto.canvasY + objeto.imagenHeight / 2 + 18
				);
				this.ctx.rotate(objeto.rotate);
				this.ctx.translate(-objeto.imagenWidth / 2, -objeto.imagenHeight / 2);
				this.ctx.drawImage(
					Imagen,
					0,
					0,
					objeto.imagenWidth,
					objeto.imagenHeight
				);

				this.ctx.restore();

				this.ctx.restore();
			}
		});

		this.listaReordenarCanvas = [];
	}

	//
	async recuperarPagina() {
		var fondoSeleccionado = '';

		this.listaModoEdicion.forEach((objeto) => {
			var imagenRecuperada = new ImagenToBackend();

			imagenRecuperada.url = objeto.url;
			imagenRecuperada.nombre = objeto.nombre;
			imagenRecuperada.tipo = objeto.tipo;
			imagenRecuperada.especial = objeto.especial;
			imagenRecuperada.imagenDataX = objeto.imagenDataX;
			imagenRecuperada.imagenDataY = objeto.imagenDataY;
			imagenRecuperada.translate = objeto.translate;

			imagenRecuperada.imagenWidth = objeto.imagenWidth;
			imagenRecuperada.imagenHeight = objeto.imagenHeight;
			imagenRecuperada.invertir = objeto.invertir;

			imagenRecuperada.canvasX = objeto.canvasX;
			imagenRecuperada.canvasY = objeto.canvasY;

			imagenRecuperada.rotate = objeto.rotate;
			imagenRecuperada.zindex = objeto.zindex;

			imagenRecuperada.fondoUrl = objeto.fondoUrl;

			fondoSeleccionado = objeto.fondoUrl;

			this.listaFotosDeEscena.push(imagenRecuperada);
		});

		this.seleccionarfondo(fondoSeleccionado);
		this.listaTexto.forEach((texto) => {
			var Texto = new Image();

			Texto.src = this.value;

			this.ctx.drawImage(
				Texto,
				texto.imagenX,
				texto.imagenY,
				texto.imagenWidth,
				texto.imagenHeight
			);

			this.ctx.fillText(texto.textoString, texto.textoX, texto.textoY);
		});
	}

	//Variable necesaria para recolocar los elementos
	recolocarObjeto = false;

	//Funcion encargada de recolocar los elementos que hay en una pagina cuando se decide editar.
	async recolocar() {
		this.recolocarObjeto = true;

		console.log('READY');
		var fondoSeleccionado = '';
		this.listaFotosDeEscena.forEach((element) => {
			this.listaModoEdicion.forEach((edicion) => {
				if (this.zIndexImagenes < edicion.zindex) {
					this.zIndexImagenes = edicion.zindex;
				}

				fondoSeleccionado = edicion.fondoUrl;
				this.fondoRecolocarEdit = edicion.fondoUrl;
				if (element.nombre == edicion.nombre) {
					element.invertir = edicion.invertir;
					var imagenObjeto = document.getElementById(
						element.nombre
					) as HTMLImageElement;

					imagenObjeto.classList.add('positionAbsolute');
					//document.getElementById(objeto).style.position="absolute
					imagenObjeto.style.zIndex = '' + edicion.zindex + '';

					if (edicion.invertir == -1) {
						imagenObjeto.style.transform =
							'translate(' +
							edicion.imagenDataX +
							'px, ' +
							edicion.imagenDataY +
							'px) scaleX(' +
							edicion.invertir +
							') rotate(' +
							edicion.rotate * -1 +
							'rad)';
					} else {
						imagenObjeto.style.transform =
							'translate(' +
							edicion.imagenDataX +
							'px, ' +
							edicion.imagenDataY +
							'px) scaleX(' +
							edicion.invertir +
							') rotate(' +
							edicion.rotate +
							'rad)';
					}

					imagenObjeto.setAttribute('data-x', edicion.imagenDataX);
					imagenObjeto.setAttribute('data-y', edicion.imagenDataY);
					imagenObjeto.setAttribute('data-angle', edicion.rotate);

					imagenObjeto.width = edicion.imagenWidth;
					imagenObjeto.height = edicion.imagenHeight;

					imagenObjeto.style.width = edicion.imagenWidth + 'px';
					imagenObjeto.style.height = edicion.imagenHeight + 'px';
				}
			});
		});
		this.delay(50);

		this.seleccionarfondo(fondoSeleccionado);
		this.vaciar();
	}

	//Esta funcion nos ayuda a vaciar la lista en el caso que el usuario desee seguir creando apginas una vez acaba de editar una.
	vaciar() {
		console.log('1: ' + this.listaPersonajesPagina);
		this.listaPersonajesPagina = [];
		console.log('2: ' + this.listaPersonajesPagina);
	}

	//Variable necesaria para dotar de ID a cada bocadillo de texto
	contadorTexto = 0;
	
	//Funcion utilizada para que cuando hagamos click encima del canvas, genere un bocadillo de texto.
	canvasClick2(event) {
		if (this.fondoElegido == '') {
			return;
		}

		this.ctx = this.canvas.nativeElement.getContext('2d');
		var x = event.clientX;
		var y = event.clientY;
		var texto = '';
		texto = this.copiarTexto(texto);
		console.log('X: ' + x + 'Y: ' + y);
		console.log(
			'El usuario ha escrito: ' + texto + ' TamaÃ±o texto: ' + texto.length
		);

		var plusWidth = texto.length;

		var prueba = document.getElementById('prueba') as HTMLImageElement;

		this.ctx.drawImage(
			prueba,
			x - prueba.width / 2,
			y - prueba.height / 2,
			this.ctx.measureText(texto).width + prueba.width,
			prueba.height + texto.length * 0.25
		);

		this.ctx.fillText(texto, x, y);

		var textoPrueba = new TextoCuento();
		textoPrueba.textoID = this.contadorTexto;
		textoPrueba.textoString = texto;
		textoPrueba.textoX = x;
		textoPrueba.textoY = y;
		textoPrueba.imagenX = x - prueba.width / 2;
		textoPrueba.imagenY = y - prueba.height / 2;
		textoPrueba.imagenWidth = this.ctx.measureText(texto).width + prueba.width;
		textoPrueba.imagenHeight = prueba.height + texto.length * 0.25;
		this.contadorTexto = this.contadorTexto + 1;

		this.listaTexto.push(textoPrueba);

		var ul = document.getElementById('inputs');
		var li = document.createElement('li');

		li.setAttribute('type', 'checkbox');
		li.setAttribute('id', '' + textoPrueba.textoID + '');

		li.addEventListener('click', (e) => {
			this.removeTextoDesdeLista(li); 
		});

		li.appendChild(document.createTextNode(textoPrueba.textoString));
		ul.appendChild(li);
	}

	//Funcion utilizada para retrasar algunas acciones y dar tiempo a la app a cargarse.
	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/*
	Variables necesarias para organizar los objetos y personajes en la pantalla.
	*/
	contadorColocadorObjetoX = 0;
	contadorColocadorObjetoY = 1;

	contadorColocadorPersonajeX = 0;
	contadorColocadorPersonajeY = 1;

	//Funcion encargada de, una vez cargados los recursos, organizar estos en la pantalla del editor
	async seleccionarobjeto(imageO: ImagenToBackend, imagenNombre) {
		var multiplicadorX = 50;
		var multiplicadorY = 40;
		var separacionEntreTipos = 250;
		if (this.resX <= 1024) {
			multiplicadorX = 28;
			multiplicadorY = 30;
			separacionEntreTipos = 140;
		}

		this.listaFotosDeEscena.push(imageO);
		await this.delay(50);

		if (imagenNombre == 'Objeto') {
			var imagenObjeto = document.getElementById(
				imageO.nombre
			) as HTMLImageElement;

			imagenObjeto.style.transform =
				'translate(' +
				(multiplicadorX * this.contadorColocadorObjetoX +
					separacionEntreTipos) +
				'px, ' +
				multiplicadorY * this.contadorColocadorObjetoY +
				'px)';
			imagenObjeto.setAttribute(
				'data-x',
				'' +
					(multiplicadorX * this.contadorColocadorObjetoX +
						separacionEntreTipos) +
					''
			);
			imagenObjeto.setAttribute(
				'data-y',
				'' + multiplicadorY * this.contadorColocadorObjetoY + ''
			);
			imagenObjeto.style.width = '' + this.imagenSizeDeInicioWidth + 'px';
			imagenObjeto.style.height = '' + this.imagenSizeDeInicioHeight + 'px';
			imagenObjeto.style.rotate = '0';

			this.contadorColocadorObjetoX++;

			if (this.contadorColocadorObjetoX >= 4) {
				this.contadorColocadorObjetoY++;
				this.contadorColocadorObjetoX = 0;
			}
		} else if (imagenNombre == 'Personaje') {
			var imagenPersonaje = document.getElementById(
				imageO.nombre
			) as HTMLImageElement;

			imagenPersonaje.style.transform =
				'translate(' +
				multiplicadorX * this.contadorColocadorPersonajeX +
				'px, ' +
				multiplicadorY * this.contadorColocadorPersonajeY +
				'px)';
			imagenPersonaje.setAttribute(
				'data-x',
				'' + multiplicadorX * this.contadorColocadorPersonajeX + ''
			);
			imagenPersonaje.setAttribute(
				'data-y',
				'' + multiplicadorY * this.contadorColocadorPersonajeY + ''
			);
			imagenPersonaje.style.width = '' + this.imagenSizeDeInicioWidth + 'px';
			imagenPersonaje.style.height = '' + this.imagenSizeDeInicioHeight + 'px';
			imagenPersonaje.style.rotate = '0';

			this.contadorColocadorPersonajeX++;

			if (this.contadorColocadorPersonajeX >= 4) {
				this.contadorColocadorPersonajeY++;
				this.contadorColocadorPersonajeX = 0;
			}
		}
	}
	
	//Variable necesaria para la funcion fondoRecolocar
	fondoRecolocarEdit = '';

	//Esta funcion ayuda al desarrollador a indicarle si se ha recolocado el fondo esperado en modo editar.
	fondoRecolocar(fondo: any) {
		console.log('FONDORECOLOCAR');
		console.log(fondo);
		this.fondoRecolocarEdit = fondo;
		console.log(document.getElementById(fondo));
	}

	//Variable necesaria para seleccionarfondo
	fondoElegido = '';

	//Funcion encargada de colocar fondo, ya sea en modo editar o no.
	seleccionarfondo(urlrwae: string) {
		var Imagen = new Image();
		Imagen.src = urlrwae;
		this.fondoElegido = urlrwae;
		this.ctx = this.canvas.nativeElement.getContext('2d');
		this.ctx.drawImage(Imagen, 0, 0, this.deviceCanvasX, this.deviceCanvasY);

		if (localStorage.getItem('modoEditar') == 'true') {
			var fondoEdit = document.getElementById(
				'' + this.fondoRecolocarEdit + ''
			) as HTMLImageElement;
			this.delay(60);
			console.log(
				'fondoEdit: ' + fondoEdit + ' O.O ' + this.fondoRecolocarEdit
			);
			this.ctx = this.canvas.nativeElement.getContext('2d');
			this.ctx.drawImage(
				fondoEdit,
				0,
				0,
				this.deviceCanvasX,
				this.deviceCanvasY
			);
		}

		this.listaTexto.forEach((texto) => {
			var Texto = new Image();

			Texto.src = this.value;

			this.ctx.drawImage(
				Texto,
				texto.imagenX,
				texto.imagenY,
				texto.imagenWidth,
				texto.imagenHeight
			);

			this.ctx.fillText(texto.textoString, texto.textoX, texto.textoY);
		});
	}

	//Traigo las imagenes de mi recurso que hay en la API
	traeImagenesRecursoLibro(): any {
		var nivel3 = localStorage.getItem('nivel3');

		const Observables = new Observable((obs) => {
			this.listaFotosPersonajes = [];
			this.listaFotosFondos = [];
			this.listaFotosObjetos = [];

			this.recursoCargadoPregunta = true;
			console.log('This');
			this.recursoCargado = this.listaRecursos.filter(
				(recuro) => recuro.id === this.listaRecursos[0].id
			)[0];

			console.log(
				'La longitud del recurso cargado es de: ' + this.listaRecursos.length
			);
			this.recursoCargado.imagenes.forEach(async (element) => {
				let res = await this.dBservice
					.getImagenesRecurso(this.recursoCargado.carpeta, element.nombre)
					.subscribe((res) => {
						const blob = new Blob([res.blob()], { type: 'image/png' });
						const reader = new FileReader();

						reader.addEventListener(
							'load',
							() => {
								var foto = null;
								foto = reader.result.toString();
								var fotoProps = new ImagenToBackend();
								fotoProps.url = foto;
								fotoProps.tipo = element.tipo;
								if (element.especial == true) {
									fotoProps.especial = 'Especial';
									console.log(
										'Hay una imagen especial es la: ' + element.nombre
									);
								} else {
									fotoProps.especial == '';
								}

								fotoProps.nombre = element.nombre;

								if (element.tipo == 'fondo') {
									if (element.especial == false) {
										this.listaFotosFondos.push(fotoProps);
									} else if (element.especial == true && nivel3 == 'true') {
										this.listaFotosFondos.push(fotoProps);
									}
								} else if (element.tipo == 'personaje') {
									if (element.especial == false) {
										this.listaFotosPersonajes.push(fotoProps);
									} else if (element.especial == true && nivel3 == 'true') {
										this.listaFotosPersonajes.push(fotoProps);
									}
								} else if (element.tipo == 'objeto') {
									if (element.especial == false) {
										this.listaFotosObjetos.push(fotoProps);
									} else if (element.especial == true && nivel3 == 'true') {
										this.listaFotosObjetos.push(fotoProps);
									}
								}
							},
							false
						);

						if (blob) {
							reader.readAsDataURL(blob);
						}
					});

			});
		});

		return Observables;
	}

	//Funcion encargada de traer toda la información necesaria para recolocar los elementos en el modo editar
	async getApiElementos() {
		let res = await this.dBservice
			.getElemento(localStorage.getItem('idEditar'), 90)
			.toPromise();
		console.log('El res de Recolocar:');
		console.log(res);
		this.listaModoEdicion = res;
		console.log('////////////////////');
	}

	//Recuperamos la lista de recursos donde se encuentran las imagenes para la app//
	async recuperarListaRecursos() {
		this.listaRecursos = [];
		let res = await this.dBservice
			.recuperarListaRecursosJuego(localStorage.getItem('idJuego'))
			.toPromise();
		console.log(1);
		this.listaRecursos = res;
		console.log(69);
		console.log(this.listaRecursos);
	}

	////
	//Funcion que que voltea //
	////
	invertir() {
		var arrow = document.getElementById('prueba');
		document.getElementById('prueba').classList.remove('draggable');
		document.getElementById('prueba').classList.remove('drag-rotate');
		document.getElementById('prueba').classList.remove('resize-drag');
		this.resizeAngle = false;

		var x = arrow.dataset.x;
		var y = arrow.dataset.y;

		if (this.girarImagen == 0) {
			if (typeof x != 'undefined' && typeof y != 'undefined') {
				arrow.style.transform =
					'translate(' + x + 'px, ' + y + 'px) scaleX(-1)';
			} else {
				arrow.style.transform = 'scaleX(-1)';
			}

			this.girarImagen = 1;
		} else {
			console.log('ENTRAMOS AL ELSE');
			if (typeof x != 'undefined' && typeof y != 'undefined') {
				arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(1)';
			} else {
				arrow.style.transform = 'scaleX(1)';
			}

			this.girarImagen = 0;
		}
	}

	resizeAngle = false;
	primeroResize = false;

	////
	//FunciÃ³n que sirve para agrandar o disminuir el tamaÃ±o de la imagen//
	////
	resize() {
		this.primeroResize = true;
		console.log('CAMBIAMOS TAMAÃ‘O');

		this.resizeAngle = true;

		//document.getElementById("prueba").classList.remove('resize-drag');
		document.getElementById('prueba').classList.remove('#rotate-area');
		document.getElementById('prueba').classList.remove('draggable');
		document.getElementById('prueba').classList.add('resize-drag');

		console.log('Lista recibida en resize: ' + this.listaFotosDeEscena);
		this.listaFotosDeEscena.forEach((element) => {
			console.log(element.nombre);
			document.getElementById(element.nombre).classList.add('resize-drag');
			if (element.invertir == -1) {
				document
					.getElementById(element.nombre)
					.classList.add('cajitaInvertida');
			} else if (element.invertir == 1) {
				document.getElementById(element.nombre).classList.add('cajita');
			}
			document.getElementById(element.nombre).classList.remove('draggable');
			document.getElementById(element.nombre).classList.remove('drag-rotate');
		});

		var lista = this.listaFotosDeEscena;

		console.log(document.getElementById('prueba'));

		interact('.resize-drag').resizable({
			// resize from all edges and corners
			edges: { left: false, right: true, bottom: true, top: false },
			margin: 75,

			listeners: {
				move(event) {
					var target = event.target;

					var x = parseFloat(target.getAttribute('data-x')) || 0;
					var y = parseFloat(target.getAttribute('data-y')) || 0;

					console.log('x: ' + x + ' y: ' + y);

					var invertir = 1;

					lista.forEach((element) => {
						if (document.getElementById(element.nombre) == event.target) {
							document
								.getElementById(element.nombre)
								.classList.remove('#rotate-area');
							invertir = element.invertir;
						}
					});

					// update the element's style
					target.style.width = event.rect.width + 'px';
					target.style.height = event.rect.height + 'px';

					// translate when resizing from top or left edges
					x += event.deltaRect.left;
					y += event.deltaRect.top;

					var rotation = parseFloat(target.getAttribute('data-angle')) || 0;

					target.style.webkitTransform = target.style.transform =
						'translate(' +
						x +
						'px,' +
						y +
						'px) scaleX(' +
						invertir +
						') rotate(' +
						rotation +
						'rad); position: absolute;z-index:2';

					target.setAttribute('data-x', x);
					target.setAttribute('data-y', y);
					target.textContent =
						Math.round(event.rect.width) +
						'\u00D7' +
						Math.round(event.rect.height);
				},
			},
			modifiers: [
				// keep the edges inside the parent
				interact.modifiers.restrictEdges({
					outer: 'parent',
				}),

				// minimum size
				interact.modifiers.restrictSize({
					min: { width: 100, height: 50 },
				}),
			],

			inertia: true,
		});
	}

	////
	//FunciÃ³n que sirve para modificar la orientacion de la imagen//
	////
	arregloGirar() {
		if (this.primeroGiro == false) {
			this.girar();
			this.primeroGiro = true;
		} else if (this.primeroGiro == true) {
			this.girar();
			this.girar();
		}
	}

	primeroGiro = false;


	//Funcion encargada de girar los elementos
	girar() {
		var angle = 0;
		console.log(document.getElementById('prueba'));
		document.getElementById('prueba').classList.add('drag-rotate');

		this.resizeAngle = false;

		console.log('bUENAS');

		var lista = this.listaFotosDeEscena;

		this.listaFotosDeEscena.forEach((element) => {
			console.log(element.nombre);
			document.getElementById(element.nombre).classList.add('drag-rotate');
			document.getElementById(element.nombre).classList.remove('draggable');
			document.getElementById(element.nombre).classList.remove('resize-drag');
			document.getElementById(element.nombre).classList.remove('cajita');
			document
				.getElementById(element.nombre)
				.classList.remove('cajitaInvertida');
		});

		interact('.drag-rotate').draggable({
			onstart: function (event) {
				const element = event.target;
				const rect = element.getBoundingClientRect();

				// store the center as the element has css `transform-origin: center center`
				element.dataset.centerX = rect.left + rect.width / 2;
				element.dataset.centerY = rect.top + rect.height / 2;
				// get the angle of the element when the drag starts
				element.dataset.angle = getDragAngle(event);
			},
			onmove: function (event) {
				var element = event.target;
				var center = {
					x: parseFloat(element.dataset.centerX) || 0,
					y: parseFloat(element.dataset.centerY) || 0,
				};
				var angle = getDragAngle(event);

				var invertir = 1;

				lista.forEach((element) => {
					if (document.getElementById(element.nombre) == event.target) {
						invertir = element.invertir;
					}
				});

				// update transform style on dragmove

				var x = element.dataset.x;
				var y = element.dataset.y;

				// element.style.transform = 'rotate(' + angle + 'rad' + ') scaleX('+invertir+')';
				if (typeof x != 'undefined' && typeof y != 'undefined') {
					element.style.transform =
						'translate(' +
						x +
						'px, ' +
						y +
						'px) rotate(' +
						angle +
						'rad) scaleX(' +
						invertir +
						')';
				} else {
					element.style.transform =
						'rotate(' + angle + 'rad' + ') scaleX(' + invertir + ')';
				}
			},
			onend: function (event) {
				const element = event.target;

				// save the angle on dragend
				element.dataset.angle = getDragAngle(event);
			},
		});

		function getDragAngle(event) {
			var element = event.target;
			var startAngle = parseFloat(element.dataset.angle) || 0;
			var center = {
				x: parseFloat(element.dataset.centerX) || 0,
				y: parseFloat(element.dataset.centerY) || 0,
			};
			var angle = Math.atan2(
				center.y - event.clientY,
				center.x - event.clientX
			);

			return angle - startAngle;
		}
	}

	//Funcion encargada de desplegar el texto que se encuentra en bocadillos de texto dentro del canvas
	desplegarTexto() {
		var checkList = document.getElementById('list1');
		if (checkList.classList.contains('visible'))
			checkList.classList.remove('visible');
		else checkList.classList.add('visible');
	}
	modoTexto() {
		this.listaFotosDeEscena.forEach((element) => {
			document.getElementById(element.nombre).classList.remove('#rotate-area');

			document.getElementById(element.nombre).classList.remove('draggable');
			document.getElementById(element.nombre).classList.remove('resize-drag');
		});

		var ul = document.getElementById('inputs');

		this.listaTexto.forEach((obj) => {
			var li = document.createElement('li');
			li.setAttribute('type', 'checkbox');
			li.setAttribute('id', '' + obj.textoID + '');

			li.addEventListener('click', (e) => {
				this.removeTextoDesdeLista(li); //your typescript function
			});

			li.appendChild(document.createTextNode(obj.textoString));
			ul.appendChild(li);
		});
	}
	
	//Funcion utilizada para eliminar el último bocadillo escrito por el usuario.
	removeTexto(id) {
		console.log('ANTES:');
		this.listaTexto.forEach((element) => {
			console.log('String: ' + element.textoString + ' ID: ' + element.textoID);
		});

		this.listaTexto = this.listaTexto.filter((item) => item.textoID !== id);
		console.log('LONGITUD DEL TEXTO: ' + this.listaTexto.length);
		console.log('DESPUES:');
		this.listaTexto.forEach((element) => {
			console.log('String: ' + element.textoString + ' ID: ' + element.textoID);
		});

		document.getElementById(id).remove();
	}

	//Funcion para eliminar texto de la lista de bocadillos
	removeTextoDesdeLista(element: any) {
		var id = parseFloat(element.getAttribute('id'));

		console.log('Id a eliminar: ' + id);

		this.removeTexto(id);

		this.seleccionarfondo(this.fondoElegido);
	}

	//Funcion utilizada para eliminar el último bocadillo escrito por el usuario.
	eliminarTexto() {
		this.contadorTexto = this.contadorTexto - 1;
		var IDmasGrande = '0';
		this.listaTexto.forEach((texto) => {
			if (texto.textoID >= IDmasGrande) {
				IDmasGrande = texto.textoID;
			}
		});
		this.removeTexto(parseFloat(IDmasGrande));

		this.seleccionarfondo(this.fondoElegido);
	}

	//Arrastro de momento todos los objetos que he aÃ±adido a la funcion listaFOtosDeEscena//
	primeroArrastro = false;

	arrastrarElemento() {
		this.primeroArrastro = true;

		console.log('llamamos a funcion arrastrar');
		console.log(this.listaFotosDeEscena);

		this.resizeAngle = false;

		var lista = this.listaFotosDeEscena;

		this.listaFotosDeEscena.forEach((element) => {
			console.log(element.nombre);
			document.getElementById(element.nombre).classList.remove('drag-rotate');
			document.getElementById(element.nombre).classList.add('draggable');
			document.getElementById(element.nombre).classList.remove('resize-drag');
			document.getElementById(element.nombre).classList.remove('cajita');
			document
				.getElementById(element.nombre)
				.classList.remove('cajitaInvertida');
		});

		//document.getElementById("hola").classList.add('draggable');
		console.log(this.listaFotosDeEscena[0]);

		console.log(document.getElementById('prueba'));

		interact('.draggable').draggable({
			// enable inertial throwing
			inertia: true,
			// keep the element within the area of it's parent
			modifiers: [
				interact.modifiers.restrictRect({
					restriction: 'parent',
					endOnly: true,
				}),
			],
			// enable autoScroll
			autoScroll: true,

			listeners: {
				// call this function on every dragmove event
				move: dragMoveListener,

				// call this function on every dragend event
				end(event) {
					var textEl = event.target.querySelector('p');

					textEl &&
						(textEl.textContent =
							'moved a distance of ' +
							Math.sqrt(
								(Math.pow(event.pageX - event.x0, 2) +
									Math.pow(event.pageY - event.y0, 2)) |
									0
							).toFixed(2) +
							'px');
				},
			},
		});

		function dragMoveListener(event) {
			var invertir = 1;
			var target = event.target;
			var rotation = parseFloat(target.getAttribute('data-angle')) || 0;
			var rotate = 0;
			lista.forEach((element) => {
				if (document.getElementById(element.nombre) == event.target) {

					invertir = element.invertir;
					rotate = element.rotate;
				}
			});
			// keep the dragged position in the data-x/data-y attributes
			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			var j = target.dataset.angle;

			// translate the element
			target.style.webkitTransform = target.style.transform =
				'translate(' +
				x +
				'px,' +
				y +
				'px) rotate(' +
				rotation +
				'rad) scaleX(' +
				invertir +
				')';

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		}

		// this function is used later in the resizing and gesture demos
		window.dragMoveListener = dragMoveListener;
	}

	//Funcion utilizada para volver al menu libro
	public Atras() {
		this.router.navigate(['/menu-libro']);
		localStorage.setItem('modoEditar', 'false');
		localStorage.setItem('backMode', 'true');
	}

	////
	//Funcion que sirve para arrastrar la imagen//
	////
	arrastrar() {
		console.log('llamamos a funcion arrastrar');
		//document.getElementById("hola").classList.add('draggable');
		document.getElementById('prueba').classList.remove('#rotate-area');
		document.getElementById('prueba').classList.remove('resize-drag');
		document.getElementById('prueba').classList.add('draggable');
		console.log(document.getElementById('prueba'));
		var prueba34 = this.prueba34;

		interact('.draggable').draggable({
			// enable inertial throwing
			inertia: true,
			// keep the element within the area of it's parent
			modifiers: [
				interact.modifiers.restrictRect({
					restriction: 'parent',
					endOnly: true,
				}),
			],
			// enable autoScroll
			autoScroll: true,

			listeners: {
				// call this function on every dragmove event
				move: dragMoveListener,

				// call this function on every dragend event
				end(event) {
					var textEl = event.target.querySelector('p');

					textEl &&
						(textEl.textContent =
							'moved a distance of ' +
							Math.sqrt(
								(Math.pow(event.pageX - event.x0, 2) +
									Math.pow(event.pageY - event.y0, 2)) |
									0
							).toFixed(2) +
							'px');
				},
			},
		});

		function dragMoveListener(event) {
			var target = event.target;
			// keep the dragged position in the data-x/data-y attributes
			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			var rotation = parseFloat(target.getAttribute('data-angle')) || 0;

			console.log(rotation);
			// translate the element
			target.style.webkitTransform = target.style.transform =
				'translate(' +
				x +
				'px,' +
				y +
				'px) rotate(' +
				rotation +
				'rad) scaleX(' +
				prueba34 +
				')';

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		}

		// this function is used later in the resizing and gesture demos
		window.dragMoveListener = dragMoveListener;
	}
}

declare global {
	interface Window {
		dragMoveListener: any;
	}
}

//let FB = window.dragMoveListener; // ok now
