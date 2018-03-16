import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {BaseUrlInterceptor} from './base-url.interceptor';
import {environment} from '../../environments/environment';

const url = environment.apiUrl;

describe('BaseUrlInterceptor', () => {

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BaseUrlInterceptor,
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

  it('should attach the config api url to every request', inject([HttpClient], http => {
    http.get('/data').subscribe();

    httpMock.expectOne(`${url}/data`);
  }));
});
