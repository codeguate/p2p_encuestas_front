import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AppComponent } from "./../app.component";
import { GlobalsService } from "./_services/globals.service";
import { LangService } from "./_services/lang.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $: any

interface searchValue {
  searchContent:string,
  type:string
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  Table:any
  @BlockUI() blockUI: NgBlockUI;
  @Input() result;
  lang: Observable<string>;
  tipoUsuario:number = +localStorage.getItem('currentTipoUsuarioId');
  mainImg:string = localStorage.getItem('currentAvatar');
  public agregados: any[] = [];
  browserLang:any;
  translate:any;
  public user = {
    username:null,
    email:null,
    name:null,
    lastname:null,
    id:null,
    picture:null,
    state:null,
    rol:null,
    idrol:null,
    token:null,
    idcliente:null
  }
  constructor(
    private router: Router,
    private LangService: LangService,
    private GlobalsService: GlobalsService,
    public app: AppComponent
    ) {}

  ngOnInit() {
    this.lang = this.LangService.getLang()
    this.LangService.loadData();
    this.app.translate.addLangs(['en', 'es']);
    this.app.translate.setDefaultLang('en');
    // this.browserLang = this.app.translate.getBrowserLang();
    this.browserLang = 'en';
    this.translate = this.app.translate;
    this.changeLang()
    this.fullSession(true);
    this.cargarCarrito()
    this.cargarGetCarrito();
    this.getCategories();
    this.getParnerts();
    setTimeout(() => {
    this.fullSession(true);

    }, 500);

    $('.bg-animate-adds').css( {'background-image': 'url("./../assets/png/fondos/fondo1.jpeg")'} );
    // this.changeIMG();
  }

  abrirModal(){
    $('#loginTemplate').removeClass('container');
      $('#generalModalDetalle').modal("show");
  }
  activeModal(message?){
    this.blockUI.start(message);

    setTimeout(() => {
      this.blockUI.stop();
    }, 2500)
  }
  changeIMG(){
    var i = 1;
      var cambiar = setInterval( function(){
        //$('#cambiante').css( 'background-image', 'url("2.jpg")' );
        $('.bg-animate-adds').animate({
          opacity: 1
        }, 'slow', function(){

          $(this).css( {'background-image': 'url("./../assets/png/fondos/fondo' + i + '.jpeg")'} )
          .animate({opacity: 1});
          i++;
          if ( i == 2 ) { i = 1  };
        });
      }, 500);
  }


  changeLang(){
    // this.browserLang = lang;
    // console.log(this.browserLang);

    this.app.translate.use(this.browserLang);
    this.app.translate.resetLang(this.browserLang)

  }
  cargarGetCarrito(){
    let datos = localStorage.getItem('carrito');
    if(datos){
      this.agregados = JSON.parse(datos);
    }
  }
  fullSession(dato:boolean){
    // console.log(this.user);

    if(dato){
      this.user = {
        username:localStorage.getItem('currentUser'),
        email:localStorage.getItem('currentEmail'),
        name:localStorage.getItem('currentNombres'),
        lastname:localStorage.getItem('currentApellidos'),
        id:localStorage.getItem('currentId'),
        picture:localStorage.getItem('currentPicture'),
        state:localStorage.getItem('currentState'),
        rol:localStorage.getItem('currentRol'),
        idrol:localStorage.getItem('currentRol'),
        token:null,
        idcliente:null
      }

    }else{
      this.user = {
        username:null,
        email:null,
        name:null,
        lastname:null,
        id:null,
        picture:null,
        state:null,
        rol:null,
        idrol:null,
        token:null,
        idcliente:null
      }
    }
  }
  cargarCarrito(){
    let datos = localStorage.getItem('carrito');
    if (datos) {
      //localStorage.getItem('carrito')
      this.agregados = JSON.parse(datos);

    }
  }
  getCategories(){


  }
  getParnerts(){



  }
  getSearch($event){
    // let semaforo = false;
    // if($event.keyCode==13){
    //   semaforo = true;
    // }
    // if(!$event.keyCode){
    //   semaforo = true;
    // }
    // if(semaforo){
    //   this.changeValSerach()

    // let info = this.searchValues.searchContent;
    // this.tipo = this.searchValues.type;
    // if($('#searchContent').hasClass('d-none')){
    //   this.blockUI.start();
    // }
    // // this.searchType?tipo="services":tipo="supliers";
    //   this.router.navigate([`./../search/${this.tipo}/${info}`])
    //   // console.log(this.searchContent);

    //   let params = null
    //   if(this.tipo=='All'){
    //     params = {
    //       search: this.searchValues.searchContent,
    //     }
    //   }else{
    //     params = {
    //       tipo: this.getType(this.tipo),
    //       search: this.searchValues.searchContent,
    //     }
    //   }
    // let dato = {
    //   searchContent: this.searchValues.searchContent,
    //   type: (this.tipo)
    // }
    // this.GlobalsService.changeSearch(dato);
    // this.BisService.getFind(params)
    //                     .then(response => {
    //                       response.forEach(element => {
    //                         if(this.agregados.find(data => {
    //                           return data.id == element.id
    //                         })){
    //                           element.compare = true;
    //                           element.ranking = 5;
    //                         }else{
    //                           element.compare = false;
    //                           element.ranking = 5;
    //                         }

    //                       });
    //                       this.Table = response;
    //                       this.GlobalsService.changeResults(response);
    //                       this.changeValSerach();
    //                       this.blockUI.stop();
    //                     }).catch(error => {
    //                       console.clear
    //                       this.blockUI.stop();
    //                     })
    // }
    // this.changeResults.emit(this.Table)
    // this.GlobalsService.changeResults(this.Table);
  }
  getType(type:string){
    switch(type){
      case 'Services':{
        return 1;
      }
      case 'Products':{
        return 2;
      }
      case 'Supliers':{
        return 3;
      }
      default:{
        return 0;
      }
    }
  }

  navegar(url:string,id?:number){
    this.router.navigate([url])
    if(id && id>0){
      localStorage.setItem('idCategory',id+'');
    }
  }
  logout(){
    this.fullSession(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentFirstName');
    localStorage.removeItem('currentLastName');
    localStorage.removeItem('currentId');
    localStorage.removeItem('currentPicture');
    localStorage.removeItem('currentState');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentBisCardId');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentApellidos');
    localStorage.removeItem('currentNombres');
    localStorage.removeItem('currentEstado');
    localStorage.removeItem('currentSalt');
    localStorage.removeItem('currentTelefono');
    localStorage.removeItem('currentAvatar');
    localStorage.removeItem('token');
    localStorage.removeItem('currentNuevaSesion');
    localStorage.removeItem('currentTipoUsuarioId');
    // localStorage.clear();
      this.router.navigate([`../../../../../../`])

  }
  removeShoppingCar(data: any) {
    this.agregados.splice(this.agregados.findIndex(dat => {
      return dat.id == data.id
    }), 1)
    this.cargarGetCarrito();
  }
  emptyShoppingCar(){
    this.agregados.length=0;
    // this.Navegador.agregados.length=0;
    localStorage.setItem('carrito', JSON.stringify(this.agregados));
    this.cargarGetCarrito();
  }
  addShoppingCar(data:any){
    this.agregados.push(data);
    localStorage.setItem('carrito', JSON.stringify(this.agregados));

    this.cargarGetCarrito();
  }


  postProject(){
    localStorage.setItem('lastLinkUrl','post-project')
    if (!localStorage.getItem('currentUser')) {
      $('#loginTemplate').removeClass('container');
      $('#generalModalDetalle').modal("show");
    }else{
      this.router.navigate([`post-project`])
    }
  }
}
