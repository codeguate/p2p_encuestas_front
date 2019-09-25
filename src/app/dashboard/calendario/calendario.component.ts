import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  calendarPlugins = [dayGridPlugin]; // important!

}
