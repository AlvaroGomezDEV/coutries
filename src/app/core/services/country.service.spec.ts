import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService]
    });

    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debe obtener todos los países paginados', () => {
    const mockCountries = [
      { cca3: 'ESP', name: { common: 'España' } },
      { cca3: 'FRA', name: { common: 'Francia' } },
      { cca3: 'ITA', name: { common: 'Italia' } }
    ];

    service.getAllCountries(1, 2).subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries[0].cca3).toBe('ESP');
      expect(countries[1].cca3).toBe('FRA');
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });

  it('debe obtener un país por código', () => {
    const mockCountry = { cca3: 'ESP', name: { common: 'España' } };

    service.getCountryByCode('ESP').subscribe(country => {
      expect(country.cca3).toBe('ESP');
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/alpha/ESP');
    expect(req.request.method).toBe('GET');
    req.flush([mockCountry]);
  });

  it('debe devolver países paginados desde caché si ya están cargados', () => {
    (service as any).allCountries = [
      { cca3: 'ESP', name: { common: 'España' } },
      { cca3: 'FRA', name: { common: 'Francia' } },
      { cca3: 'ITA', name: { common: 'Italia' } }
    ];

    service.getAllCountries(1, 2).subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries[0].cca3).toBe('ESP');
      expect(countries[1].cca3).toBe('FRA');
    });

    httpMock.expectNone('https://restcountries.com/v3.1/all');
  });

  it('debe manejar errores al obtener un país por código', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    service.getCountryByCode('XYZ').subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/alpha/XYZ');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching country: ',
      jasmine.any(HttpErrorResponse)
    );
  });

  afterEach(() => {
    httpMock.verify();
  });
});
