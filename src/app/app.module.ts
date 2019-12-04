import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
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
  MatSliderModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    TabsComponent
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
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DeviceInfoDialogComponent,
    CancelConfirmationDialogComponent,
    FileprefixGroupSetDialogComponent
  ]
})
export class AppModule { }
