import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from "./../../home/_services/users.service";
import { EncuestasService } from "./../../home/_services/encuestas.service";
import { EdecanService } from "./../../home/_services/edecan.service";
import { AuthService } from "./../../home/_services/auth.service";
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { path } from "../../config.module";

declare var $: any
@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  tipoUsuario:number = +localStorage.getItem('currentRol');
  sesionNueva = localStorage.getItem('currentNuevaSesion');
  ranking=5;
  private basePath:string = path.path
  SelectedData:any = null;
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
    private EdecanService: EdecanService,
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

                    // console.log(response);

                      this.blockUI.stop();
                    }).catch(error => {
                      console.clear
                      this.blockUI.stop();
                      this.createError(error)
                    })
  }

  guardar(){
    this.blockUI.start();
    let url = $('#imagenComentario').attr("src")
    if(url!=""){


    let data = {
      titulo: url,
      imagen: url,
      url: url,
      state: 1,
      promotor: null,
      edecan: localStorage.getItem('currentId'),
      evento: null
    }
    this.EdecanService.create(data)
                      .then(response => {
                        this.createSuccess('Imagen agregada')
                        $('#imagenComentario').attr("src",'http://placehold.it/500X500?text=X')
                        $('#guardarImagenes').attr("disabled",true)
                        this.cargarOne();
                        console.clear


                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
                    }

  }

  subirImagenes(archivo,form,id){
    var archivos=archivo.srcElement.files;
    // ${this.basePath}/
    let url = `${this.basePath}/api/upload`

    var i=0;
    var size=archivos[i].size;
    var type=archivos[i].type;
        if(size<(5*(1024*1024))){
          if(type=="image/png" || type=="image/jpeg" || type=="image/jpg"){
        $("#"+id).upload(url,
            {
              avatar: archivos[i],
              carpeta: "Edecanes"
          },
          function(respuesta)
          {
            $('#imagenComentario').attr("src",'')
            $('#imagenComentario').attr("src",respuesta)
            $("#"+id).val('')
            $("#barra_de_progreso").val(0)
            $('#guardarImagenes').attr("disabled",false)
            $("#stopLoader").click();
          },
          function(progreso, valor)
          {

            $("#barra_de_progreso").val(valor);
          }
        );
          }else{
            this.createError("El tipo de imagen no es valido")
          }
      }else{
        this.createError("La imagen es demaciado grande")
      }
  }
  delete(id:string){
    this.blockUI.start();
    if(confirm("¿Desea eliminar la Foto?")){
      this.EdecanService.delete(id)
                        .then(response => {
                          this.cargarOne()
                          console.clear
                          this.createSuccess('Foto Eliminada exitosamente')
                          this.blockUI.stop();
                      }).catch(error => {
                          console.clear
                          this.createError(error)
                          this.blockUI.stop();
                        })
    }else{
      $('#Loading').css('display','none')
    }

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
