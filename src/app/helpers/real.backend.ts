import {BaseRequestOptions, Http, XHRBackend} from '@angular/http';

export function realBackendFactory(backend: XHRBackend, options: BaseRequestOptions) {
  return new Http(backend, options);
}
