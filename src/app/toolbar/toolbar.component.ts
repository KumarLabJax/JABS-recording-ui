import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  public title =  environment.appName;
}
