import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public translate: TranslateService) {
    // console.log('enter to this point and check the language');  
    translate.addLangs(['es']);
    translate.setDefaultLang('es');
    translate.use('es');
  };

  ngOnInit(): void {
  
    // this.translate.setDefaultLang('es');    
  }

}
