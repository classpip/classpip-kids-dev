import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'formulario-libro',
    loadChildren: () => import('./formulario-libro/formulario-libro.module').then( m => m.FormularioLibroPageModule)
  },
  {
    path: 'menu-libro',
    loadChildren: () => import('./menu-libro/menu-libro.module').then( m => m.MenuLibroPageModule)
  },
  {
    path: 'visor-de-escenas',
    loadChildren: () => import('./visor-de-escenas/visor-de-escenas.module').then( m => m.VisorDeEscenasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'menu-principal',
    loadChildren: () => import('./menu-principal/menu-principal.module').then( m => m.MenuPrincipalPageModule)
  },
  {
    path: 'mis-juegos',
    loadChildren: () => import('./mis-juegos/mis-juegos.module').then( m => m.MisJuegosPageModule)
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
  },
  {
    path: 'mis-grupos',
    loadChildren: () => import('./mis-grupos/mis-grupos.module').then( m => m.MisGruposPageModule)
  },
  {
    path: 'cuentos-a-espiar',
    loadChildren: () => import('./cuentos-a-espiar/cuentos-a-espiar.module').then( m => m.CuentosAEspiarPageModule)
  },
  {
    path: 'inicio-juego-coleccion',
    loadChildren: () => import('./inicio-juego-coleccion/inicio-juego-coleccion.module').then( m => m.InicioJuegoColeccionPageModule)
  },
  {
    path: 'album-alumno',
    loadChildren: () => import('./album-alumno/album-alumno.module').then( m => m.AlbumAlumnoPageModule)
  },
  {
    path: 'inicio-juego-puntos',
    loadChildren: () => import('./inicio-juego-puntos/inicio-juego-puntos.module').then( m => m.InicioJuegoPuntosPageModule)
  },
  {
    path: 'memorama-coleccion',
    loadChildren: () => import('./memorama-coleccion/memorama-coleccion.module').then( m => m.MemoramaColeccionPageModule)
  },
  {
    path: 'wally',
    loadChildren: () => import('./wally/wally.module').then( m => m.WallyPageModule)
  },
  {
    path: 'pruebamemorama',
    loadChildren: () => import('./pruebamemorama/pruebamemorama.module').then( m => m.PruebamemoramaPageModule)
  },
  {
    path: 'fondoanimado',
    loadChildren: () => import('./fondoanimado/fondoanimado.module').then( m => m.FondoanimadoPageModule)
  },
  {
    path: 'ejemploimplementacion',
    loadChildren: () => import('./ejemploimplementacion/ejemploimplementacion.module').then( m => m.EjemploimplementacionPageModule)
  },  {
    path: 'un-ejemplo',
    loadChildren: () => import('./un-ejemplo/un-ejemplo.module').then( m => m.UnEjemploPageModule)
  },
  {
    path: 'instrucciones-memorama',
    loadChildren: () => import('./instrucciones-memorama/instrucciones-memorama.module').then( m => m.InstruccionesMemoramaPageModule)
  },

];

@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
