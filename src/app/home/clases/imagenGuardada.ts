export class ImagenToBackend {
    
  url: any
  nombre: any;
  tipo: any;
  especial: any;
  id: any;
  positionlista: any;

  imagenDataX: any;
  imagenDataY: any;
  translate: any;
  invertir: any;

  imagenWidth:any;
  imagenHeight:any;

  canvasX:any;
  canvasY:any;

  rotate:any;

  zindex:any;

  fondoUrl:any;

  constructor(url?: any, nombre?: any, tipo?:any, especial?:any, imagenDataX=0,
    imagenDataY=0, translate?: any, invertir=1, imagenWidth=0, imagenHeight=0,canvasX?:any,canvasY?:any,rotate?:any,zindex?:any,fondoUrl?:any) {

    this.url = url;
    this.nombre = nombre;
    this.tipo = tipo;
    this.especial = especial;
    this.imagenDataX=imagenDataX;
    this.imagenDataY=imagenDataY;
    this.translate=translate;

    this.invertir=invertir;

    this.imagenWidth=imagenWidth;
    this.imagenHeight=imagenHeight;

    this.canvasX=canvasX;
    this.canvasY=canvasY;

    this.rotate=rotate;

    this.zindex=zindex;

    this.fondoUrl=fondoUrl;

  }
  }
  