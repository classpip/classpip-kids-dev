import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstruccionesMemoramaPage } from './instrucciones-memorama.page';

describe('InstruccionesMemoramaPage', () => {
  let component: InstruccionesMemoramaPage;
  let fixture: ComponentFixture<InstruccionesMemoramaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstruccionesMemoramaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstruccionesMemoramaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
