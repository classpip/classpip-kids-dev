import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InicioJuegoPuntosPage } from './inicio-juego-puntos.page';

describe('InicioJuegoPuntosPage', () => {
  let component: InicioJuegoPuntosPage;
  let fixture: ComponentFixture<InicioJuegoPuntosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioJuegoPuntosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioJuegoPuntosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
