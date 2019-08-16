import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from "./../../home/_services/users.service";
import { AuthService } from "./../../home/_services/auth.service";
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { path } from "../../config.module";

declare var $: any
@Component({
  selector: 'app-promotor',
  templateUrl: './promotor.component.html',
  styleUrls: ['./promotor.component.css']
})
export class PromotorComponent implements OnInit {
  tipoUsuario:number = +localStorage.getItem('currentTipoUsuarioId');
  sesionNueva = localStorage.getItem('currentNuevaSesion');
  ranking=5;
  private basePath:string = path.path
  SelectedData:any = null;
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
  constructor(
    private _service: NotificationsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private AuthService: AuthService,
    private UsersService:UsersService,
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
    $('html, body').animate({scrollTop:0}, '300');
    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');
    // $('#UploadProfileImg').modal('show');
    // this.blockUI.reset();
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
                      this.SelectedData.apellido = ((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')
                      this.SelectedData.nombre = ((this.SelectedData.nombres)?this.SelectedData.nombres:'')+' '+((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')
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

  update(formValue:any){
    this.blockUI.start();
    setTimeout(() => {

        this.blockUI.stop();
    }, 1000);
    formValue.id = localStorage.getItem('currentId');
    let nombres = formValue.nombre.split(' ')
    let apellidos = formValue.apellido.split(' ')
    this.SelectedData.nombres = nombres[0] ;
    this.SelectedData.apellidos = nombres[1] ;
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
                        this.SelectedData = response;
                        this.SelectedData.apellido = ((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')
                        this.SelectedData.nombre = ((this.SelectedData.nombres)?this.SelectedData.nombres:'')+' '+((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')

                        //  console.log(response);

                        console.clear


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
      foto: url,
      id: localStorage.getItem('currentId'),
    }
    this.UsersService.update(data)
                      .then(response => {
                        this.createSuccess('Foto de perfil guardada')
                        this.SelectedData = response
                        this.SelectedData = response;
                        this.SelectedData.apellido = ((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')
                        this.SelectedData.nombre = ((this.SelectedData.nombres)?this.SelectedData.nombres:'')+' '+((this.SelectedData.apellidos)?this.SelectedData.apellidos:'')
                        $('#UploadProfileImg').modal('hide');
                        $('#imagenComentario').attr("src",'http://placehold.it/500X500?text=X')
                        $('#guardarImagenes').attr("disabled",true)
                        //  console.log(response);
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
              carpeta: "PROFILE"
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
  uploadImg(){
    $('#UploadProfileImg').modal('show');
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
