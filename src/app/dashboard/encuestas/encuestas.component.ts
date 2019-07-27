import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EncuestasService } from "./../../home/_services/encuestas.service";
import { ComentariosEncuestasService } from "./../../home/_services/comentarios-encuestas.service";
import { ImagenesService } from "./../../home/_services/imagenes.service";
import { AuthService } from "./../../home/_services/auth.service";
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/switchMap';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { path } from "../../config.module";

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
  lat:any=14.66430813990437
  lng:any=-90.51446914672852
  localidades:any
  today:any = this.hoy();
  now1:any = this.now();
  private basePath:string = path.path
  SelectedData:any = null;
  edad:any = "18-25"
  genero:any = "hombre"
  comentario:any = ""
  imagen:any = ""
  id:number = +localStorage.getItem('currentId');
  sesion:boolean=false;
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
    private ComentariosService: ComentariosEncuestasService,
    private ImagenesService: ImagenesService,
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
  getParams(){
    try{
      let idTemp = '';
      if(this.route.snapshot){
         idTemp = this.route.snapshot.paramMap.get("id");

      }


      this.sesion=true;

      this.id = +idTemp
      if(this.sesion){
        this.cargarOne(this.id);
      }
    }
    catch(e){
      this.sesion=false;
    }
  }
  ngOnInit() {
    this.today = this.hoy();
    this.now1 = this.now();
    $('html, body').animate({scrollTop:0}, '300');
    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');


    this.getParams();
  }
  mainData = {
    titulo : "Encuesta "+this.today+" - "+this.now1,
    direccion: "",
    id: 0,
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
  cargarOne(id?:any){
    // this.blockUI.reset();
    if(!id){
      this.id = +localStorage.getItem('currentId');
    }
    // this.blockUI.start();
    this.SelectedData = null;
    this.UsersService.getSingle(this.id)
                    .then(response => {
                      this.SelectedData = response;
                      let tempData = this.mainData
                      this.mainData = response;

                      if(response.asistentes < tempData.asistentes){
                        this.mainData.asistentes = tempData.asistentes
                      }

                      if(response.ventas < tempData.ventas){
                        this.mainData.ventas = tempData.ventas
                      }
                      this.lat = parseFloat(response.latitud)
                      this.lng = parseFloat(response.longitud)
                      this.positions = new google.maps.LatLng(this.lat, this.lng);
                      console.log(response);
                      setTimeout(() => {
                        this.positions = new google.maps.LatLng(this.lat, this.lng);
                      }, 1500);
                      this.blockUI.stop();
                    }).catch(error => {
                      console.clear
                      this.blockUI.stop();
                      this.createError(error)
                    })
  }
  agregarComentario(){
    let data = {
      titulo: this.genero,
      nombre: this.edad,
      comentario: this.comentario,
      imagen: "",
      url: null,
      state: 1,
      encuesta: this.mainData.id
    }
    this.blockUI.start();

    this.ComentariosService.create(data)
                            .then(response => {
                              this.createSuccess('Comentario Enviado')
                              this.genero = "hombre";
                              this.edad = "18-25";
                              this.comentario = "";
                              $('#imagenComentario').attr("src",'http://placehold.it/500X500?text=X');
                              $('#uploadImagenComentario').attr("value",'');
                              $("#comentario").focus();
                              this.getParams();
                              console.clear


                              this.blockUI.stop();
                            }).catch(error => {
                              console.clear

                              this.blockUI.stop();
                              this.createError(error)
                            })
    // console.log(data);

  }
  guardarImg(){
    this.imagen = $('#imagenComentario').attr("src")
    if(this.imagen!=""){
      let data = {
        titulo: this.imagen,
        imagen: this.imagen,
        url: this.imagen,
        state: 1,
        encuesta: this.mainData.id,
      }
      this.blockUI.start();
      this.ImagenesService.create(data)
                        .then(response => {
                            this.createSuccess('Imagen Guardada')
                            this.imagen = response.url
                            // console.log(response);
                            if(response.id){
                              $('#imagenComentario').attr("src",'http://placehold.it/500X500?text=X');
                              $('#uploadImagenComentario').attr("value",'');
                              this.imagen="";
                              this.getParams();
                            }
                            console.clear
                            this.blockUI.stop();
                        }).catch(error => {
                            console.clear

                            this.blockUI.stop();
                            this.createError(error)
                        })
    }

  }
  insert(formValue:any){
    this.mainData = {
      titulo : this.mainData.titulo,
      direccion: this.mainData.direccion,
      asistentes: this.mainData.asistentes,
      ventas: this.mainData.ventas,
      hora_inicio: this.mainData.hora_inicio,
      fecha_inicio: this.mainData.fecha_inicio,
      hora_fin: this.mainData.hora_fin,
      fecha_fin: this.mainData.fecha_fin,
      latitud: this.lat,
      longitud: this.lng,
      type: this.mainData.type,
      id: this.mainData.id,
      state: this.mainData.state,
      user:+localStorage.getItem('currentId')
    }
    this.blockUI.start();
    if(this.mainData.id>0){
      this.UsersService.update(this.mainData)
                            .then(response => {

                              if(response.id && response.user>0){
                                this.createSuccess('Encuesta Actualizada')
                                this.mainData = response
                              }
                              console.clear


                              this.blockUI.stop();
                            }).catch(error => {
                              console.clear

                              this.blockUI.stop();
                              this.createError(error)
                            })
    }else{
      this.UsersService.create(this.mainData)
                            .then(response => {
                              this.createSuccess('Encuesta Enviada')
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
              carpeta: "Encuestas"
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
