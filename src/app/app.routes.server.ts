import { RenderMode, ServerRoute } from '@angular/ssr';
import { Country } from './core/models/country.model';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'country/:code',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const countries = await fetch('https://restcountries.com/v3.1/all')
        .then((response) => response.json())
        .then((data) => data.map((country: Country) => country.cca3))

      return countries.map((code: string) => ({ code }))
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];