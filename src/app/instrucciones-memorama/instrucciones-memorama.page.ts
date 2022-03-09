import { Component, OnInit,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-instrucciones-memorama',
  templateUrl: './instrucciones-memorama.page.html',
  styleUrls: ['./instrucciones-memorama.page.scss'],
})
export class InstruccionesMemoramaPage implements OnInit {

  constructor() { }

  @Output()
  textoCambiado: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
  }
  cambioTexto(texto:string){

    this.textoCambiado.emit(texto);

  }

}
