import { FavoritesStore } from './favorites.store';
import { Country } from '../models/country.model';

describe('FavoritesStore', () => {
  let store: FavoritesStore;

  const mockCountry: Country = {
    name: {
      common: 'Cameroon',
      official: 'Republic of Cameroon'
    },
    cca2: 'CM',
    cca3: 'CMR',
    region: 'Africa',
    flags: {
      png: 'https://flagcdn.com/w320/cm.png',
      svg: 'https://flagcdn.com/cm.svg',
      alt: 'Flag of Cameroon'
    },
    population: 26545864,
    capital: ['Yaoundé']
  };

  beforeEach(() => {
    store = new FavoritesStore();
  });

  it('debe iniciar sin favoritos', () => {
    expect(store.favorites()).toEqual([]);
    expect(store.favoritesCount()).toBe(0);
  });

  it('debe agregar un favorito', () => {
    store.addFavorite(mockCountry);
    expect(store.favorites()).toContain(mockCountry);
    expect(store.favoritesCount()).toBe(1);
    expect(store.isFavorite('CMR')()).toBeTrue();
  });

  it('no debe agregar duplicados', () => {
    store.addFavorite(mockCountry);
    store.addFavorite(mockCountry);
    expect(store.favorites().length).toBe(1);
  });

  it('debe eliminar un favorito', () => {
    store.addFavorite(mockCountry);
    store.removeFavorite('CMR');
    expect(store.favorites()).not.toContain(mockCountry);
    expect(store.favoritesCount()).toBe(0);
    expect(store.isFavorite('CMR')()).toBeFalse();
  });

  it('toggleFavorite debe agregar si no existe', () => {
    store.toggleFavorite(mockCountry);
    expect(store.isFavorite('CMR')()).toBeTrue();
  });

  it('toggleFavorite debe eliminar si ya existe', () => {
    store.addFavorite(mockCountry);
    store.toggleFavorite(mockCountry);
    expect(store.isFavorite('CMR')()).toBeFalse();
  });
});