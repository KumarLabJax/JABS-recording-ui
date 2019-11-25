import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  public filter: string;

  public stateFilters = {
    idle: true,
    busy: true,
    down: true
  };

  constructor() { }

  public formatChartPercentage(n: number) {
    return n.toFixed(1);
  }

  public updateFilter(event) {
    this.filter = event.target.value.trim().toLowerCase();
  }
}
