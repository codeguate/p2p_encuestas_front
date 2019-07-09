import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Location } from '@angular/common';
import { EventosFuncionesAreaService } from "./../_services/eventos-funciones-area.service";
import { EventosVentasService } from "./../_services/eventos-ventas.service";
declare var $: any

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  dataSearch = {
    id:'',
    lugares:[],
    total:0,
    titulo:'',
    funcion:''
  }
  vendedores:any=[]
  SelectedData:any = null
  errorPago:boolean = false
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
    this.dataSearch.id = this.route.snapshot.paramMap.get("id").split(':')[0];
    this.dataSearch.titulo = this.route.snapshot.paramMap.get("id").split(':')[1];
    if(this.route.snapshot.paramMap.get("id").split(':')[2]){
      this.errorPago = true;
    }else{
      this.errorPago = false;
    }
    this.cargarSingle(+this.dataSearch.id)
  }

  cargarSingle(id:number){
    let datos = localStorage.getItem('selectedSillas');
    if (datos) {
      //localStorage.getItem('carrito')
      this.SelectedData = JSON.parse(datos);
      this.vendedores = this.SelectedData.descuentos?this.SelectedData.descuentos:[];
      // console.log(this.vendedores);

      // localStorage.removeItem('selectedSillas');

    }
    // console.log(this.SelectedData);

    // this.blockUI.start();
    //   this.mainService.getSingle(id)
    //                       .then(response => {
    //                         response.lugares.forEach((element,i) => {
    //                           element.titulo = element.titulo+' '+(i+1);
    //                           element.selected = false;
    //                         });
    //                         this.SelectedData = response;
    //                         console.log(response);
    //                         this.blockUI.stop();
    //                       }).catch(error => {
    //                         console.clear
    //                         this.blockUI.stop();
    //                         this.createError(error)
    //                       })
  }
  buscarPromo(data:any){
    this.blockUI.start();
    let paso = false;
    let vendedores = []
    this.SelectedData.eventos.vendedores.forEach(element => {
        if(element.usuarios && (element.usuarios.codigo==data.promoCode)){
          paso = true;
          vendedores.push(element)
        }
    });

    if(paso){
      vendedores.forEach(element => {
        element.descuento = element.porcentaje>0?true:false;
        let data = {
          titulo:'Descuento de '+(element.descuento?(element.porcentaje+"%"):(element.cantidad)),
          porcentaje:(element.descuento?(element.porcentaje/100):(element.cantidad)),
          email:element.usuarios?element.usuarios.email:element.titulo,
          codigo:element.usuarios?element.usuarios.codigo:element.titulo,
          total: element.descuento?((this.SelectedData.totalAll*(element.porcentaje/100))):(element.cantidad)
        }
        // this.SelectedData.totalAll = element.descuento?(this.SelectedData.totalAll-(this.SelectedData.totalAll*(element.porcentaje/100))):(this.SelectedData.totalAll-element.cantidad);
        this.SelectedData.descuento = this.SelectedData.descuento+(element.descuento?((this.SelectedData.totalAll*(element.porcentaje/100))):(element.cantidad));
        this.vendedores.push(data)
        this.SelectedData.evento_vendedor = element.id
      });
      this.SelectedData.descuentos = this.vendedores
      localStorage.setItem('selectedSillas',JSON.stringify(this.SelectedData));

      $("#promoCode").prop('disabled',true);
      $("#promoCodeBTN").prop('disabled',true);
    }else{
      this.createError('Este codigo promocional no es valido')
    }


    this.blockUI.stop();

    // console.log(this.SelectedData);


  }
  insert(){
    if(this.SelectedData.lugares.length>0){
      localStorage.setItem('selectedSillas',JSON.stringify(this.SelectedData));
      this.blockUI.start();
      let descuento = 0;
      this.vendedores.forEach(element => {
        descuento += element.porcentaje;
      });
      descuento = this.vendedores.length>0?descuento/this.vendedores.length:0
      // console.log(this.vendedores);
      // console.log(descuento);

      let data = {
        cantidad: this.SelectedData.lugares.length,
        precio: parseFloat(this.SelectedData.precio)-(parseFloat(this.SelectedData.precio)*descuento),
        descripcion: 'Pago',
        id: 1,
        url: "comewme.com"
      }
      console.log(data);

      this.paidService.pagar(data)
                          .then(response => {
                            // console.log(response);
                            window.open(response.token,'_self');
                            this.blockUI.stop();
                          }).catch(error => {
                            console.clear
                            this.blockUI.stop();
                            this.createError(error)
                          })

    }
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
