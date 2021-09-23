import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  entries: Array<{ name: string; link: string; }> = [{
    name: 'Login',
    link: 'login'
  }, {
    name: 'Register',
    link: 'register'
  }];

  constructor(private router: Router) { }

  navigateTo(url: string) {
    console.log({ url });

    this.router.navigate([url]);
  }
}
