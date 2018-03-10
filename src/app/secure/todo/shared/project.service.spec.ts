import {TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SavedProject} from './saved-project';
import {TemporaryProject} from './temporary-project';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });

    httpClient = TestBed.get(HttpTestingController);
    service = TestBed.get(ProjectService);
  });

  afterAll(() => {
    httpClient.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: test for errors in backend response

  describe('getProjects', () => {
    it('should get the projects', () => {
      const expectedProjects = [
        {
          _id: 'testid',
          name: 'Math',
          color: 'dfd532'
        },
        {
          _id: 'onetwo',
          name: 'Science',
          color: 'ff3d3f'
        }
      ];

      service.getProjects().subscribe(
        projects => expect(projects).toEqual(expectedProjects as SavedProject[], 'should return projects'),
        fail
      );

      const req = httpClient.expectOne('/project');
      expect(req.request.method).toBe('GET');

      req.flush(expectedProjects);
    });
  });
  describe('getProjectById', () => {
    it('should get a project by id and return it', () => {
      const expectedProject = {
        _id: 'test123',
        name: 'hello world',
        color: '353691'
      };

      service.getProjectById('test123').subscribe(
        project => expect(project).toEqual(expectedProject as SavedProject, 'should return project'),
        fail
      );

      const req = httpClient.expectOne('/project/test123');
      expect(req.request.method).toBe('GET');

      req.flush(expectedProject);
    });
  });
  describe('createProject', () => {
    it('should create a project and return it', () => {
      const temporaryProject = new TemporaryProject({
        tempId: 'i should not be included in body',
        name: 'test',
        color: '444555'
      });

      const realProject = {
        _id: 'real database id',
        name: 'test',
        color: '444555'
      };

      service.createProject(temporaryProject).subscribe(
        project => expect(project).toEqual(realProject as SavedProject, 'should return the created project'),
        fail
      );

      const req = httpClient.expectOne('/project');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'test',
        color: '444555'
      });

      req.flush(realProject);
    });
  });
  describe('updateProjectById', () => {
    it('should update a project by id and return it', () => {
      const expectedProject = new SavedProject({
        _id: 'real-database-id',
        name: 'different name and color',
        color: '674435'
      });

      service.updateProjectById(expectedProject).subscribe(
        project => expect(project).toEqual(expectedProject as SavedProject, 'should return the updated project'),
        fail
      );

      const req = httpClient.expectOne('/project/real-database-id');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        name: 'different name and color',
        color: '674435'
      });

      req.flush(expectedProject);
    });
  });
  describe('patchProjectById', () => {
    it('should patch a project by id and return it', () => {
      const expectedProject = {
        _id: 'test123',
        name: 'new name',
        color: '353691'
      };

      service.patchProjectById('test123', {
        'name': 'new name'
      }).subscribe(
        project => expect(project).toEqual(expectedProject as SavedProject, 'should return updated project'),
        fail
      );

      const req = httpClient.expectOne('/project/test123');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        name: 'new name'
      });

      req.flush(expectedProject);
    });
  });
  describe('deleteProjectById', () => {
    it('should delete a project by id', () => {
      const expectedProject = {
        _id: 'test123',
        name: 'hello world',
        color: '353691'
      };

      service.deleteProjectById('test123').subscribe(
        () => {
        },
        fail
      );

      const req = httpClient.expectOne('/project/test123');
      expect(req.request.method).toBe('DELETE');

      req.flush(expectedProject);
    });
  });
});
