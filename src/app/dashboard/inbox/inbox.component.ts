import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;

declare var $: any
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  ranking:any =5
  constructor() { }
  datos={
    users:[
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      },
      {
        id:1,
        nombre:"Username"
      }
    ],
    message:[
      {

      }
    ]
  }
  ngOnInit() {
    $('html, body').animate({scrollTop:0}, '300');
    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');
  }

}
