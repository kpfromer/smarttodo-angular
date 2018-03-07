import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectComponent} from './project.component';
import {SavedProject} from '../shared/saved-project';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    component.project = new SavedProject({
      _id: 'anid',
      name: 'homework',
      color: '#4cc5ff'
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
