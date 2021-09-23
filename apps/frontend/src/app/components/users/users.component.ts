import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UserData } from '../../models/user-data.model';
import { UserService } from '../../services/user-service/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: UserData = {} as UserData;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      tap(users => console.log({ users })),
      tap((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

}
