import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Location } from '@angular/common';
import { EventosFuncionesAreaService } from "./../_services/eventos-funciones-area.service";
declare var $: any

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.css']
})
export class LocalidadesComponent implements OnInit {
  dataSearch = {
    idArea:'',
    idFuncion:''
  }
  cantidad = 0
  SelectedData:any = null
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private route: ActivatedRoute,
    private _service: NotificationsService,
    private location: Location,
    private mainService: EventosFuncionesAreaService,
    private router: Router,
  ) { }

  ngOnInit() {
    $('html, body').animate({scrollTop:0}, '300');
    this.getParams();
  }

  getParams(){
    localStorage.removeItem('selectedSillas');
    this.dataSearch.idArea = this.route.snapshot.paramMap.get("idArea");
    this.dataSearch.idFuncion = this.route.snapshot.paramMap.get("idFuncion");
    this.cargarSingle(+this.dataSearch.idArea)
  }

  cargarSingle(id:number){
    this.blockUI.start();
      this.mainService.getSingle(id)
                          .then(response => {
                            response.descuento = 0
                            response.totalAll = 0
                            response.lugares.forEach((element,i) => {
                              element.titulo = element.titulo+' '+(i+1);
                              element.selected = element.vendido;
                            });
                            this.SelectedData = response;
                            // console.log(response);
                            this.blockUI.stop();
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                          })
  }
  insert(){
    let seleccionados = []
    this.SelectedData.lugares.forEach(element => {
      if(element.selected && element.vendido==0){
        seleccionados.push(element)
      }
    });
    if(seleccionados.length>0){
      this.SelectedData.lugares = seleccionados
      localStorage.setItem('selectedSillas',JSON.stringify(this.SelectedData));
      this.router.navigate(['./../../../../checkout/'+this.SelectedData.id+':'+(this.SelectedData.eventos.titulo.replace(/ /g,'_'))])

    }
  }

  add(){
    let seleccionados = []
    this.SelectedData.lugares.forEach(element => {
      if(element.selected && element.vendido==0){
        seleccionados.push(element)
      }
    });
    if(seleccionados.length>0){
      this.cantidad = seleccionados.length;
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
                            this.cargarSingle(response.id);
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
                            console.log(response);

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
