import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InicioJuegoColeccionPage } from './inicio-juego-coleccion.page';

describe('InicioJuegoColeccionPage', () => {
  let component: InicioJuegoColeccionPage;
  let fixture: ComponentFixture<InicioJuegoColeccionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioJuegoColeccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioJuegoColeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
