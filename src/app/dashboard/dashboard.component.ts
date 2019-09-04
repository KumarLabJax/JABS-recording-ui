import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public deviceSummary = [
    {name: 'down', value: 0},
    {name: 'idle', value: 0},
    {name: 'busy', value: 0}
  ];

  public chartColorScheme = {
    domain: ['#FF0000', '#32CD32', '#FFA500']
  };

  constructor() { }

  public formatChartPercentage(n: number) {
    return n.toFixed(1);
  }
}
