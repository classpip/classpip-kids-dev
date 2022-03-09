export class ImagenesObjetos{
    imagenID: any;
    imagenX: number;
    imagenY: number;
    imagenWidth: number;
    imagenHeigth: number;
    imagenURL: any;
    
    constructor(
    imagenID=0,
    imagenX= 0,
    imagenY= 0,
    imagenWidth=0,
    imagenHeigth=0,
    imagenURL=''
    ){
    
        this.imagenID = imagenID,
        this.imagenX= imagenX,
        this.imagenY=imagenY,
        this.imagenWidth=imagenWidth,
        this.imagenHeigth=imagenHeigth,
        this.imagenURL=imagenURL
    }
    }
    