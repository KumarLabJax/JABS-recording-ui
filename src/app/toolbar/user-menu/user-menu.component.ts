import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit, OnDestroy {

  public isAuthenticated = false;
  public emailAddress: string;
  private authSub: Subscription;
  private usernameSub: Subscription;

  constructor(private loginService: LoginService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.authSub = this.loginService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });
    this.usernameSub = this.loginService.userEmail$.subscribe(value => {
      this.emailAddress = value;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.usernameSub.unsubscribe();
  }

  logout() {
    this.loginService.logout();
  }

  changePassword() {
    this.matDialog.open(ChangePasswordDialogComponent);
  }
}
