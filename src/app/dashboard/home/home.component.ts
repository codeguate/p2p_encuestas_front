import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from "./../../home/_services/users.service";
import { EncuestasService } from "./../../home/_services/encuestas.service";
import { AuthService } from "./../../home/_services/auth.service";
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $: any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tipoUsuario:number = +localStorage.getItem('currentRol');
  sesionNueva = localStorage.getItem('currentNuevaSesion');
  ranking=5;
  SelectedData:any = null;
  UTable:any = null;
  Table:any = null;
  today:any = this.hoy();
  now1:any = this.now();
  id:number = +localStorage.getItem('currentId');
  selected={
    GovermentID:false,
    ComercialPatent:false,
    EmailAddress:false,
    PhoneNumber:false,
    BussinessAddress:false
  };
  mainData = {
    password:'',
    username:localStorage.getItem('currentEmail'),
    id:+localStorage.getItem('currentId'),
    type:'changepass'
  }
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
    // console.log(stoday);

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
    private EncuestasService: EncuestasService,
    private location: Location,
    private router: Router,
    private AuthService: AuthService,
    private UsersService:UsersService,
    ) { }

    generar(){
      let string = this.SelectedData.birthday+":"+this.SelectedData.username;
      let encodedString = btoa(string);
      this.SelectedData.codigo =  encodedString.substr(encodedString.length-10,encodedString.length);
      this.UsersService.update(this.SelectedData)
                      .then(response => {
                        this.createSuccess('Profile Saved')
                        this.SelectedData = response
                        console.clear


                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
    }
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
    this.cargarAll();
    this.cargarOne();
    if(this.tipoUsuario==1){
      this.cargarAllEncuestas();
    }
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

  irEncuesta(){
    let mainData = {
      titulo : "Encuesta "+this.today+" - "+this.now1,
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
    this.blockUI.start();
    this.EncuestasService.create(mainData)
                      .then(response => {
                        this.router.navigate([`./../../dashboard/encuesta/${response.id}`])
                        this.createSuccess('Encuesta Guardada')
                        mainData = response
                        console.clear


                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
  }

  cargarAll(){
    // this.blockUI.reset();

    this.id = +localStorage.getItem('currentId');
    // this.blockUI.start();
    this.SelectedData = null;

    let data = {
      id:localStorage.getItem('currentId'),
      state:localStorage.getItem('currentId'),
      filter:'user'
    }
    this.EncuestasService.getAllFilter(data)
                    .then(response => {
                      this.Table = response;

                      setTimeout(() => {
                      $(".pull-right").css("display","none");
                      $(".pagination").css("padding-left","20%");

                      }, 200);
                      // console.log(response);

                      this.blockUI.stop();
                    }).catch(error => {
                      console.clear
                      this.blockUI.stop();
                      this.createError(error)
                    })
  }

  cargarAllEncuestas(){
    // this.blockUI.reset();

    let data = {
      id:localStorage.getItem('currentId'),
      state:localStorage.getItem('currentId'),
      filter:'user'
    }
    this.EncuestasService.getAll()
                    .then(response => {
                      this.UTable = response;
                      console.log(response);

                      setTimeout(() => {
                      $(".pull-right").css("display","none");
                      $(".pagination").css("padding-left","20%");

                      }, 200);
                      // console.log(response);

                      this.blockUI.stop();
                    }).catch(error => {
                      console.clear
                      this.blockUI.stop();
                      this.createError(error)
                    })
  }

  update(formValue:any){
    this.blockUI.start();
    setTimeout(() => {

        this.blockUI.stop();
    }, 1000);
    formValue.id = localStorage.getItem('currentId');
    let nombres = formValue.nombre.split(' ')
    let apellidos = formValue.apellido.split(' ')
    this.SelectedData.primerNombre = nombres[0] ;
    this.SelectedData.segundoNombre = nombres[1] ;
    this.SelectedData.primerApellido = apellidos[0] ;
    this.SelectedData.segundoApellido = apellidos[1] ;
    this.SelectedData.descripcion = formValue.descripcion ;
    this.SelectedData.id = formValue.id ;
    formValue=this.SelectedData;
    this.UsersService.update(formValue)
                      .then(response => {
                        this.createSuccess('Profile Saved')
                        this.SelectedData = response
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

}
