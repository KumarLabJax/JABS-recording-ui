import { Component } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  animations: [
    trigger('isPresent', [
      transition(':enter', [
        style({ height: 0 }),
        animate('120ms cubic-bezier(.73,0,.2,1)',
          style({ height: '*' })
        )
      ]), transition(':leave', [
        style({ height: '*' }),
        animate('120ms cubic-bezier(.73,0,.2,1)',
          style({ height: 0 })
        )
      ])
    ])
  ]
})
export class TabsComponent {

  navLinks = [
    {name: 'DASHBOARD', url: 'dashboard'},
    {name: 'NEW RECORDING SESSION', url: 'new-session'},
  ];

  constructor() {}
}
