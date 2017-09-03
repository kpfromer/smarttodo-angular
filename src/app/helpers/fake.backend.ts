import {BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {encodeTestToken} from 'angular2-jwt/angular2-jwt-test-helpers';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions) {
  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    const testUser = {username: 'test', password: 'test', firstName: 'Test', lastName: 'User'};

    // wrap in timeout to simulate server api call
    setTimeout(() => {

      if (connection.request.url.endsWith('/hello') && connection.request.method === RequestMethod.Get) {
        connection.mockRespond(new Response(
          new ResponseOptions({status: 202, statusText: 'Hello, Tests!'})
        ));
      }

      // fake authenticate api end point
      if (connection.request.url.endsWith('/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request
        const params = JSON.parse(connection.request.getBody());

        // check user credentials and return fake jwt token if valid
        if (params.username === testUser.username && params.password === testUser.password) {

          const id_token = encodeTestToken({
            'exp': 9999999999
          });

          connection.mockRespond(new Response(
            new ResponseOptions({
              status: 200, body: {
                data: {
                  id_token
                }
              }
            })
          ));
        } else {
          connection.mockRespond(new Response(
            new ResponseOptions({status: 200})
          ));
        }
      }

      // fake users api end point
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return test users if valid, this security is implemented server side
        // in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(
            new ResponseOptions({status: 200, body: [testUser]})
          ));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(
            new ResponseOptions({status: 401})
          ));
        }
      }

    }, 500);

  });

  return new Http(backend, options);
}
