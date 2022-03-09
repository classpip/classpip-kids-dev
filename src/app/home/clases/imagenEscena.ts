export class imagenEscena {
    
    container: any
    name: any;
    size: any;
    atime: any;
    mtime: any;
    ctime: any;
    
    constructor(container?: any, name?: any, size?:any, atime?:any,mtime?:any,ctime?:any) {
  
      this.container = container;
      this.name = name;
      this.size = size;
      this.atime = atime;
      this.mtime = mtime
      this.ctime = ctime
    }
  }
  