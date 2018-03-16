import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {JwtInterceptor} from './jwt.interceptor';
import {JWT_OPTIONS} from './jwtoptions.token';
import {JwtService} from './jwt.service';
import createSpy = jasmine.createSpy;

describe('JwtInterceptor', () => {

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const options = {
    tokenGetter: () => 'token',
    headerName: 'headerName',
    authScheme: 'authScheme ',
    throwNoTokenError: false,
    skipWhenExpired: true
  };

  const mockJwtService = {
    isTokenExpired: createSpy('isTokenExpired')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: JWT_OPTIONS,
          useValue: options
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach the authorization token if present and valid', () => {
    httpClient.get('/data').subscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.headers.get('headerName')).toBe('authScheme token');
  });

  it('should not include authorization token if not present and throwNoTokenError is false', () => {
    spyOn(options, 'tokenGetter').and.returnValue(() => '');
    httpClient.get('/data').subscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.headers.get('headerName')).toBeNull('should not attach header');
  });

  it('should throw error if no token and throwNoTokenError');

  it('should not attach header if token is expired and skipWhenExpired');
});
