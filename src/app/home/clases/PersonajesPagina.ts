export class PersonajesPagina{

    personajeID: number;
        nombre: any;
        imagenDataX: any;
        imagenDataY: any;
    
        url: any
        tipo: any;
        especial: any;
        id: any;
        positionlista: any;
        translate: any;
        invertir: any;
             imagenWidth:any;
            imagenHeight:any;
    
            canvasX:any;
            canvasY:any;
    
            rotate:any;
    
            zindex:any;
    
            pintado:boolean;
    
            fondoUrl:any;
    
        constructor(
            personajeID=0,
            nombre='',
            imagenDataX=0,
            imagenDataY=0,
            url?: any,
            tipo?: any,
            especial?: any,
            id?: any,
            positionlista?: any,
            translate?: any,
            invertir=1,
            imagenWidth=0,
            imagenHeight=0,
            canvasX?:any,
            canvasY?:any,
            rotate?:any,
            zindex?:any,
            fondoUrl?:any,
            pintado=false
            
            
    
        ){
    
            this.personajeID=personajeID,
            this.nombre=nombre,
            this.imagenDataX=imagenDataX,
            this.imagenDataY=imagenDataY
            this.url=url,
            this.tipo=tipo,
            this.especial=especial,
            this.id=id,
            this.positionlista=positionlista,
    
            this.translate=translate
    
            this.invertir=invertir
    
            this.imagenWidth=imagenWidth;
            this.imagenHeight=imagenHeight;
            
            this.canvasX=canvasX;
            this.canvasY=canvasY;
    
            this.rotate=rotate;
    
            this.zindex=zindex;
    
            this.pintado=pintado;
    
            this.fondoUrl=fondoUrl
    
        }
    }