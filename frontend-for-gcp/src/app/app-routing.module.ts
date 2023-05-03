import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search',
    component: SearchFormComponent,
  //   children:[{
  //     path:'events',
  //     component: DashboardComponent
  //   },{
  //     path: 'detail/:id', 
  //     component: HeroDetailComponent 
  //   }]
  // 
  },
  {path: 'favorites', component: FavoritesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
