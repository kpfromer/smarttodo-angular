import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.scss']
})
export class FlashMessageComponent implements OnInit {

  @Input() color = 'warn';

  @Input() icon: string | null = 'error';

  constructor() { }

  ngOnInit() {
  }

}
