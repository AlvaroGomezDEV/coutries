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

  it('should start without favorites', () => {
    expect(store.favorites()).toEqual([]);
    expect(store.favoritesCount()).toBe(0);
  });

  it('should add a favorite', () => {
    store.addFavorite(mockCountry);
    expect(store.favorites()).toContain(mockCountry);
    expect(store.favoritesCount()).toBe(1);
    expect(store.isFavorite('CMR')()).toBeTrue();
  });

  it('should not add duplicates', () => {
    store.addFavorite(mockCountry);
    store.addFavorite(mockCountry);
    expect(store.favorites().length).toBe(1);
  });

  it('should delete a favorite', () => {
    store.addFavorite(mockCountry);
    store.removeFavorite('CMR');
    expect(store.favorites()).not.toContain(mockCountry);
    expect(store.favoritesCount()).toBe(0);
    expect(store.isFavorite('CMR')()).toBeFalse();
  });

  it('toggleFavorite should be added if it does not exist', () => {
    store.toggleFavorite(mockCountry);
    expect(store.isFavorite('CMR')()).toBeTrue();
  });

  it('toggleFavorite should be removed if it already exists', () => {
    store.addFavorite(mockCountry);
    store.toggleFavorite(mockCountry);
    expect(store.isFavorite('CMR')()).toBeFalse();
  });
});