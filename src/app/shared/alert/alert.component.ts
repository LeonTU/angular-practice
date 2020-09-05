import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  message: string = '';
  closeAlertBox = new EventEmitter<null>();
  constructor() {}

  onClick() {
    this.closeAlertBox.emit();
  }
}
