export class TextoCuento{
    textoID: any;
    textoString:any;
    textoX: any;
    textoY: any;
    imagenX: any;
    imagenY:any;
    imagenWidth:any;
    imagenHeight:any;
    
    constructor(
        textoID = 0,
        textoString ='',
        textoX=0,
        textoY=0,
        imagenX=0,
        imagenY=0,
        imagenWidth=0,
        imagenHeight=0
    ){
        this.textoID=textoID,
        this.textoString=textoString,
        this.textoX=textoX,
        this.textoY=textoY,
        this.imagenX=imagenX,
        this.imagenY=imagenY,
        this.imagenWidth=imagenWidth,
        this.imagenHeight=imagenHeight
        
    }
    
    
    }