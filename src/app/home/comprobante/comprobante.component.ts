import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Location } from '@angular/common';
import { EventosFuncionesAreaService } from "./../_services/eventos-funciones-area.service";
import { EventosVentasService } from "./../_services/eventos-ventas.service";
declare var $: any

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobante.component.html',
  styleUrls: ['./comprobante.component.css']
})
export class ComprobanteComponent implements OnInit {
  dataSearch = {
    token:'',
    ern:''
  }
  responseData=[]
  comprobante = {
    token:'',
    aprobacion:'',
    fechaAprobacion:'',
    ern:''
  }
  idUser = localStorage.getItem('currentId');
  nombres = localStorage.getItem('currentNombres');
  apellidos = localStorage.getItem('currentApellidos');
  email = localStorage.getItem('currentEmail');
  SelectedData:any = null
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private route: ActivatedRoute,
    private _service: NotificationsService,
    private location: Location,
    private paidService: EventosVentasService,
    private mainService: EventosFuncionesAreaService,
    private router: Router,
  ) { }

  ngOnInit() {
    $('html, body').animate({scrollTop:0}, '300');
    this.getParams();
  }

  getParams(){
    this.dataSearch.token = this.route.snapshot.paramMap.get("token");
    this.dataSearch.ern = this.route.snapshot.paramMap.get("ern");
    this.cargarComprobante(this.dataSearch)
  }

  cargarComprobante(dato:any){
    let datos = localStorage.getItem('selectedSillas');
    if (datos) {
      this.SelectedData = JSON.parse(datos);
      // localStorage.removeItem('selectedSillas');

    }
    if(dato.token.length<5){
      this.router.navigate(['./../../../../checkout/'+this.SelectedData.id+':'+(this.SelectedData.eventos.titulo.replace(/ /g,'_'))+':0'])
    }

    this.blockUI.start();
    let data = {
      token:dato.token,
      ern:dato.ern
    }

      this.paidService.comprobante(data)
                          .then(response => {
                            // console.log(this.SelectedData);
                            // console.log(response);
                            if(response.status!=203){
                              // localStorage.removeItem('selectedSillas');
                              this.comprobante = response;
                              // this.enviarEmail();
                              this.insert();
                            }
                            this.blockUI.stop();
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                            // console.log(error);
                            if(error.error){
                              if(error.error.message=="Compra Denegada"){
                                this.router.navigate(['./../../../../checkout/'+this.SelectedData.id+':'+(this.SelectedData.eventos.titulo.replace(/ /g,'_'))+':0'])
                              }
                            }
                          })
  }
  insert(){
      // localStorage.removeItem('selectedSillas');
      // let response1 = []
      this.blockUI.start();
      if(this.SelectedData){
        this.SelectedData.lugares.forEach(async element => {
          let data = {
            cantidad: this.SelectedData.lugares.length,
            precio: this.SelectedData.precio,
            descripcion: element.descripcion,
            url: "paid/"+this.dataSearch.token+"/"+this.dataSearch.ern,
            titulo : element.titulo,
            lugar : 'lugar',
            fechaAprobacion : this.comprobante.fechaAprobacion,
            fechaAprobacionS : this.comprobante.fechaAprobacion,
            aprobacion : this.comprobante.aprobacion,
            token : this.dataSearch.token,
            ern : this.dataSearch.ern,
            codigo : element.eventos.eventos.eventos.usuarios.codigo,
            total : this.SelectedData.totalAll-this.SelectedData.descuento,
            latitud : this.SelectedData.eventos.latitud,
            longitud : this.SelectedData.eventos.longitud,
            usuario : this.idUser,
            evento : element.eventos.eventos.evento,
            evento_funcion : element.eventos.evento_funcion,
            evento_funcion_area_lugar : element.id,
            evento_vendedor : this.SelectedData.evento_vendedor?this.SelectedData.evento_vendedor:null,
            evento_descuento : null
          }

          await this.paidService.create(data)
                              .then(async response => {
                                await this.responseData.push(response);
                                // this.blockUI.stop();

                                  // console.log("data",data);
                                  // console.log("response",response);
                              }).catch(error => {
                                console.clear
                                this.blockUI.stop();
                                this.createError(error)
                              })
        });

        this.mainService.update(this.SelectedData)
                            .then(async response => {
                              this.blockUI.stop();
                              await this.enviarEmail();
                              localStorage.removeItem('selectedSillas');
                              this.createSuccess("Su compra fue exitosa, se le redireccionara a su dashboard")
                              await this.router.navigate(['./../../../../dashboard/home'])

                                // console.log("data",data);
                                // console.log("response",response);

                            }).catch(error => {
                              console.clear
                              this.blockUI.stop();
                              this.createError(error)
                            })
        // console.log(this.responseData);
      }else{
        this.blockUI.stop();
        this.createError("Lo sentimos, tu orden no pudo ser procesada")
        this.router.navigate(['./../../../../dashboard/home'])

      }



  }
  enviarEmail(){
    this.blockUI.start();
    let data = {
      nombres:this.nombres,
      apellidos:this.apellidos,
      email:this.email,
      SelectedData:this.SelectedData,
      comprobante:this.comprobante
    }
    this.paidService.enviar(data)
                  .then(response => {
                    this.createSuccess("Su comprobante ha sido enviado");
                    this.blockUI.stop();
                  }).catch(error => {
                    console.clear
                    this.blockUI.stop();
                    this.createError(error)
                  })
  }

  add(){
    let seleccionados = []
    this.SelectedData.lugares.forEach(element => {
      if(element.selected){
        seleccionados.push(element)
      }
    });
    if(seleccionados.length>0){
      this.SelectedData.totalAll = this.SelectedData.precio*(seleccionados.length)

    }
  }
  goBack(){
    this.location.back();
  }
  buscarSingle(search:any){
    this.blockUI.start();
    let data = {
      id:search.titulo.replace(/_/g,' '),
      state:search.fecha,
      filter:'buscar'
    }
      this.mainService.getAllFilter(data)
                          .then(response => {
                            this.blockUI.stop();
                            this.cargarFunciones(response.evento);
                            this.cargarAreas(response.id);
                            // this.cargarSingle(response.id);
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                          })
  }

  cargarAreas(id:number){
    this.blockUI.start();
    let data = {
      id:0,
      state:id,
      filter:'evento_funcion'
    }
      this.mainService.getAllFilter(data)
                          .then(response => {
                            this.blockUI.stop();
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                          })
  }

  cargarFunciones(id:number){
    this.blockUI.start();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hh = String(today.getHours()).padStart(2, '0');
    let MM = String(today.getMinutes()).padStart(2, '0'); //January is 0!
    let ss = String(today.getSeconds()).padStart(2, '0'); //January is 0!
    let stoday = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + MM + ':' + ss;
    let data = {
      id:id,
      state:stoday,
      filter:'proximos_eventos'
    }
      this.mainService.getAllFilter(data)
                          .then(response => {
                            // console.log(response);

                            this.blockUI.stop();
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                          })
  }
  navegar(url:string,id?:number){
    localStorage.removeItem('lastLinkUrl')
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('lastLinkUrl',url);
      $('#loginTemplate').removeClass('container');
      $('#generalModalDetalle').modal("show");
    }else{
      this.router.navigate([url])
    }
  }
  collapse(str:string){
    if($('#'+str).collapse("show")){
      $('#'+str).collapse("hide")

    }else{
      $('#'+str).collapse("show")

    }
  }
  public options = {
    position: ["bottom", "right"],
    timeOut: 2000,
    lastOnBottom: false,
    animate: "scale",
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };

  createSuccess(success) {
    this._service.success('¡Éxito!',success)
  }
  createError(error) {
    this._service.error('¡Error!',error)
  }

}
