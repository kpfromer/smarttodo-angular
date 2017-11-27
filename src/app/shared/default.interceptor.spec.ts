import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {DefaultInterceptor} from './default.interceptor';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

describe('DefaultInterceptor', () => {

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DefaultInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('set content-type header to application/json', inject([HttpClient], http => {
    http.get('/data').subscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
  }));
});
