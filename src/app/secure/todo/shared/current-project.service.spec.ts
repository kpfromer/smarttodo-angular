import {inject, TestBed} from '@angular/core/testing';

import {CurrentProjectService} from './current-project.service';
import {Subject} from 'rxjs/Subject';
import any = jasmine.any;

describe('CurrentProjectService', () => {
  let service: CurrentProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentProjectService]
    });
  });

  beforeEach(inject([CurrentProjectService], (curentProjectService: CurrentProjectService) => {
    service = curentProjectService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a default project observable', () => {
    expect(service.defaultProject).toEqual(any(Subject));
  });

  it('should have a change project observable', () => {
    expect(service.onProjectChange).toEqual(any(Subject));
  });

  it('should have a next seven days observable', () => {
    expect(service.nextSevenDaysProject).toEqual(any(Subject));
  });
});
