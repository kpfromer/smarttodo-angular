import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CurrentProjectService {

  defaultProject = new Subject<boolean>();

  nextSevenDaysProject = new Subject<boolean>();

  onProjectChange = new Subject<string>();

  constructor() {
  }

}
