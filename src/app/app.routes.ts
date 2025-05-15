import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./features/components/country-list/country-list.component').then((m) => m.CountryListComponent)
  }
];
