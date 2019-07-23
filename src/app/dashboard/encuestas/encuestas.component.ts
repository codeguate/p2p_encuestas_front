import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EncuestasService } from "./../../home/_services/encuestas.service";
import { AuthService } from "./../../home/_services/auth.service";
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $: any
@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent implements OnInit {
  tipoUsuario:number = +localStorage.getItem('currentTipoUsuarioId');
  sesionNueva = localStorage.getItem('currentNuevaSesion');
  ranking=5;
  positions:any
  lat:any
  lng:any
  localidades:any
  today:any = this.hoy();
  now1:any = this.now();
  SelectedData:any = null;
  id:number = +localStorage.getItem('currentId');
  selected={
    GovermentID:false,
    ComercialPatent:false,
    EmailAddress:false,
    PhoneNumber:false,
    BussinessAddress:false
  };

  @BlockUI() blockUI: NgBlockUI;
  rowsItems:any=[
    {id:1}
  ]
  agregar(){
    let id = ((this.rowsItems[this.rowsItems.length-1].id)*1)+1
    this.rowsItems.push({id:id})
  }
  now(){
      let today = new Date();
      let hh = String(today.getHours()).padStart(2, '0');
      let mm = String(today.getMinutes()).padStart(2, '0'); //January is 0!
      let ss = String(today.getSeconds()).padStart(2, '0'); //January is 0!
      let stoday = hh + ':' + mm + ':' + ss;
      console.log(stoday);

      return stoday;
  }
  hoy(){
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      let stoday = yyyy + '-' + mm + '-' + dd;
      return stoday;
  }
  constructor(
    private _service: NotificationsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private AuthService: AuthService,
    private UsersService:EncuestasService,
    ) { }

    changePass(formValue:any){
      // console.log(this.mainData.hash);
      formValue.id=+localStorage.getItem('currentId')
      this.blockUI.start()
      this.AuthService.updatePass(formValue)
                      .then( response => {
                        // console.log(response);
                        this.cargarOne();
                        this.createSuccess('Su Clave fue Cambiada')
                        $('#ActualizaPass').modal('hide');
                        this.blockUI.stop()
                      })
                      .catch( error => {
                        this.createError(error)
                        this.blockUI.stop()
                      })
    }
  ngOnInit() {
    this.today = this.hoy();
    this.now1 = this.now();
    $('html, body').animate({scrollTop:0}, '300');
    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');
    // this.blockUI.reset();

    // this.cargarOne();
  }
  mainData = {
    titulo : "Encuesta "+this.today,
    direccion: "",
    asistentes: 0,
    ventas: 0,
    hora_inicio: this.now1,
    fecha_inicio: this.today,
    hora_fin: this.now1,
    fecha_fin: this.today,
    latitud: 0,
    longitud: 0,
    type: 1,
    state: 1,
    user:+localStorage.getItem('currentId')
  }
  cargarOne(){
    // this.blockUI.reset();

    this.id = +localStorage.getItem('currentId');
    // this.blockUI.start();
    this.SelectedData = null;
    this.UsersService.getSingle(this.id)
                    .then(response => {
                      this.SelectedData = response;
                      this.SelectedData.apellido = ((this.SelectedData.primerApellido)?this.SelectedData.primerApellido:'')+' '+((this.SelectedData.segundoApellido)?this.SelectedData.segundoApellido:'')
                      this.SelectedData.nombre = ((this.SelectedData.primerNombre)?this.SelectedData.primerNombre:'')+' '+((this.SelectedData.segundoNombre)?this.SelectedData.segundoNombre:'')
                      // console.log(response);
                      this.selected.GovermentID = response.verificacion?response.verificacion.indexOf("G"):false;
                      this.selected.ComercialPatent = response.verificacion?response.verificacion.indexOf("C"):false;
                      this.selected.EmailAddress = response.verificacion?response.verificacion.indexOf("E"):false;
                      this.selected.PhoneNumber = response.verificacion?response.verificacion.indexOf("P"):false;
                      this.selected.BussinessAddress = response.verificacion?response.verificacion.indexOf("B"):false;
                      if(response.state=='21'){
                        $('#ActualizaPass').modal('show');
                      }
                      this.blockUI.stop();
                    }).catch(error => {
                      console.clear
                      this.blockUI.stop();
                      this.createError(error)
                    })
  }

  insert(formValue:any){
    this.mainData = {
      titulo : "Encuesta "+this.today,
      direccion: "",
      asistentes: 0,
      ventas: 0,
      hora_inicio: this.now1,
      fecha_inicio: this.today,
      hora_fin: this.now1,
      fecha_fin: this.today,
      latitud: this.lat,
      longitud: this.lng,
      type: 1,
      state: 1,
      user:+localStorage.getItem('currentId')
    }
    this.UsersService.create(this.mainData)
                      .then(response => {
                        this.createSuccess('Profile Saved')
                        this.SelectedData = response
                        console.log(response);
                        if(response.id && response.user>0){
                          this.router.navigate([`./dashboard/home`])
                        }
                        console.clear


                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })


  }

  public options = {
      position: ['bottom', 'right'],
      timeOut: 2000,
      lastOnBottom: false,
      animate: 'fromLeft',
      showProgressBar: false,
      pauseOnHover: true,
      clickToClose: true,
      maxLength: 200
  };

  createSuccess(success) {
        this._service.success('¡Éxito!', success);

  }
  createError(error) {
        this._service.error('¡Error!', error);

  }
   // lineChart
   public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Delivered'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Completed'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'New Products'},
    {data: [90, 48, 57, 9, 10, 27, 40], label: 'New Orders'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  onMapReady(map) {
    console.log('map', map);
    console.log('markers', map.markers);  // to get all markers as an array
  }
  onIdle(event) {
    console.log('map', event.target);
  }
  onMarkerInit(marker) {
    console.log('marker', marker);
  }
  onMapClick(event) {
    this.positions = event.latLng;
      let positions1 = event.latLng + '';
      let pos = positions1.replace(')','').replace('(','').split(',')
      this.lat = pos[0]
      this.lng = pos[1]
      event.target.panTo(this.positions);
      console.log(this.lat+' @ '+this.lng+' @ '+event.latLng+'\n'+pos[0]);

  }

}
