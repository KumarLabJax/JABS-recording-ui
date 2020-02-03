import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRecordingSessionComponent } from './new-recording-session/new-recording-session.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private token: TokenService, private auth: LoginService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.token.hasTokens()) {
      this.auth.logout(state.url);
      return false;
    }
    return true;
  }
}

const routes: Routes = [
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'new-session', canActivate: [AuthGuard], component: NewRecordingSessionComponent},
  {path: 'login', component: LoginComponent, data: {showTabs: false}},
  {path: 'password-reset/:uid/:token', component: PasswordResetComponent, data: {showTabs: false}},
  {path: 'forgot-password', component: ForgotPasswordComponent, data: {showTabs: false}},
  // for now redirect the root page to the dashboard component
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
