import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit, OnDestroy {

  public isAuthenticated = false;
  public isAdmin = false;
  private authSub: Subscription;
  private adminSub: Subscription;

  constructor(private loginService: LoginService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.authSub = this.loginService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });
    this.adminSub = this.loginService.isAdmin.subscribe(value => {
      this.isAdmin = value;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.adminSub.unsubscribe();
  }

  inviteUser() {
    this.matDialog.open(InviteUserDialogComponent);
  }

}
