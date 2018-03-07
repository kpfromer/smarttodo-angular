import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectListComponent} from './project-list.component';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input} from '@angular/core';
import {Project} from '../shared/project';
import {By} from '@angular/platform-browser';

@Directive({
  selector: 'app-project'
})
class MockProjectDirective {
  @Input() project: Project;
}

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectListComponent,
        MockProjectDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;

    component.projects = [
      {
        name: 'hello',
        color: 'ff5b45'
      },
      {
        name: 'world',
        color: 'abd3ff'
      },
      {
        name: 'such code',
        color: 'fffa7e'
      }
    ] as Project[];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list the projects', () => {
    const projects = fixture.debugElement.queryAll(By.directive(MockProjectDirective));

    expect(projects.length).toBe(3);
  });

  it('should pass down project object', () => {
    const mockProject = fixture.debugElement.query(By.directive(MockProjectDirective))
      .injector.get(MockProjectDirective) as MockProjectDirective;

    expect(mockProject.project).toEqual({
      name: 'hello',
      color: 'ff5b45'
    } as Project);
  });
});
