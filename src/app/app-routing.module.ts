import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRecordingSessionComponent } from './new-recording-session/new-recording-session.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'new-session', component: NewRecordingSessionComponent},
  // for now redirect the root page to the dashboard component
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
