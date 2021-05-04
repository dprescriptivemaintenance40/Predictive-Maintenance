import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'DPM';

  constructor() {
    // window.addEventListener('beforeunload', (e) => {
    //   e.preventDefault();
    //   e.returnValue = '';
    // });
  }

  ngOnDestroy() {
    localStorage.clear();
  }

}
