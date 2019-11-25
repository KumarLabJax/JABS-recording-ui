import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRecordingSessionComponent } from './new-recording-session/new-recording-session.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'device-list', component: DeviceListComponent},
  {path: 'new-session', component: NewRecordingSessionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
