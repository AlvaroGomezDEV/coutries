import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(window, 'alert');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show "Bad Request" for error 400', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Bad Request');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should show "Unauthorized" and navigate to /login for error 401', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Unauthorized');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should show "Resource not found" for 404 error', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Resource not found');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should show "Internal Server Error" for error 500', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('should show default message for other errors', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('An unknown error occurred!');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 418, statusText: "I'm a teapot" });
  });

  it('should show ErrorEvent message', () => {
    http.get('/test').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Error: error event');
      }
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('error', { message: 'error event' }));
  });
});