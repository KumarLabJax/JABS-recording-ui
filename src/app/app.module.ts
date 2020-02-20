import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, AuthGuard } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceComponent } from './device/device.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeviceInfoDialogComponent, FormatSecondsPipe } from './device/device-info-dialog/device-info-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NewRecordingSessionComponent } from './new-recording-session/new-recording-session.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DurationPipe, SessionTableComponent } from './session-table/session-table.component';
import { CancelConfirmationDialogComponent } from './session-table/cancel-confirmation-dialog/cancel-confirmation-dialog.component';
import { FileprefixGroupSetDialogComponent } from './new-recording-session/fileprefix-group-set-dialog/fileprefix-group-set-dialog.component';
import { TabsComponent } from './tabs/tabs.component';
import { LiveStreamDialogComponent } from './live-stream-dialog/live-stream-dialog.component';
import { LiveStreamButtonComponent } from './live-stream-button/live-stream-button.component';
import { PlyrModule } from 'ngx-plyr';
import { RemoveConfirmationDialogComponent } from './session-table/remove-confirmation-dialog/remove-confirmation-dialog.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserMenuComponent } from './toolbar/user-menu/user-menu.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { UserManagementComponent } from './user-management/user-management.component';
import { ChangePasswordDialogComponent } from './toolbar/user-menu/change-password-dialog/change-password-dialog.component';
import { AdminMenuComponent } from './toolbar/admin-menu/admin-menu.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { InviteUserDialogComponent } from './toolbar/admin-menu/invite-user-dialog/invite-user-dialog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceComponent,
    DeviceListComponent,
    DeviceInfoDialogComponent,
    FormatSecondsPipe,
    DashboardComponent,
    ToolbarComponent,
    NewRecordingSessionComponent,
    SessionTableComponent,
    DurationPipe,
    CancelConfirmationDialogComponent,
    FileprefixGroupSetDialogComponent,
    TabsComponent,
    LiveStreamDialogComponent,
    LiveStreamButtonComponent,
    RemoveConfirmationDialogComponent,
    LoginComponent,
    UserMenuComponent,
    UserManagementComponent,
    ChangePasswordDialogComponent,
    AdminMenuComponent,
    PasswordResetComponent,
    InviteUserDialogComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatTooltipModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgxChartsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    PlyrModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeviceInfoDialogComponent,
    CancelConfirmationDialogComponent,
    FileprefixGroupSetDialogComponent,
    LiveStreamDialogComponent,
    RemoveConfirmationDialogComponent,
    ChangePasswordDialogComponent,
    InviteUserDialogComponent
  ]
})
export class AppModule { }
