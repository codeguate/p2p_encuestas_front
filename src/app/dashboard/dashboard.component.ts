import { Observable } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppComponent } from "./../app.component";
import { GlobalsService } from "./../home/_services/globals.service";
import { LangService } from "./../home/_services/lang.service";
declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Table:any
  Table2:any
  @Input() result;
  @BlockUI() blockUI: NgBlockUI;
  @Output() changeResults: EventEmitter<any> = new EventEmitter();
  tipoUsuario:number = +localStorage.getItem('currentTipoUsuarioId');
  public searchContent='';
  lang: Observable<string>;
  placeholder:string;
  categorias:any = null
  mainImg:string = localStorage.getItem('currentAvatar');
  public searchType:boolean = false;
  generalModal:boolean = false;
  public agregados: any[] = [];
  filter:boolean =false;
  tipo:string="All"
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
    private route: ActivatedRoute,
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
    this.changePlaceholder();
    this.changeLang()
    this.fullSession(true);
    this.cargarCarrito()
    this.cargarGetCarrito();
    this.getCategories();
    $('.bg-animate-adds').css( {'background-image': 'url("./../assets/png/fondos/fondo1.jpeg")'} )
    // this.changeIMG();
  }
  changePlaceholder(){
    this.placeholder = "What kind of "+(this.tipo=='All'?"product/service":this.tipo)+" are you looking for?"
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
      }, 3000);
  }
  changeValSerach(data){
    this.searchContent = ''
    this.searchContent = data.searchContent
    this.tipo = ''
    this.tipo = data.type
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
      this.Table2 = this.agregados
    }
  }
  fullSession(dato:boolean){
    // console.log(this.user);

    if(dato){
      this.user = {
        username:localStorage.getItem('currentUser'),
        email:localStorage.getItem('currentEmail'),
        name:localStorage.getItem('currentFirstName'),
        lastname:localStorage.getItem('currentLastName'),
        id:localStorage.getItem('currentId'),
        picture:localStorage.getItem('currentPicture'),
        state:localStorage.getItem('currentState'),
        rol:localStorage.getItem('currentRol'),
        idrol:localStorage.getItem('currentRolId'),
        idcliente:localStorage.getItem('currentClienteId'),
        token:localStorage.getItem('token')
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
    // this.blockUI.start();

    // this.CategorysService.getAll()
    //                     .then(response => {
    //                       this.categorias = response;
    //                       this.blockUI.stop();
    //                     }).catch(error => {
    //                       console.clear

    //                       this.blockUI.stop();
    //                     })

  }
  getSearch(){
    // let info = this.searchContent;
    // this.blockUI.start();
    // // this.searchType?tipo="services":tipo="supliers";
    //   this.router.navigate([`./../search/${this.tipo}/${info}`])
    //   // console.log(this.searchContent);

    //   let params = null
    //   if(this.tipo=='All'){
    //     params = {
    //       search: this.searchContent,
    //     }
    //   }else{
    //     params = {
    //       tipo: this.getType(this.tipo),
    //       search: this.searchContent,
    //     }
    //   }
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




    //                       this.blockUI.stop();
    //                     }).catch(error => {
    //                       console.clear

    //                       this.blockUI.stop();
    //                     })



    // // this.changeResults.emit(this.Table)
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
  cargarModal(flag:boolean){
    this.generalModal=flag
  }

  navegar(url:string,id?:number){
    this.router.navigate([url])
    if(id && id>0){
      localStorage.setItem('idCategory',id+'');
    }
  }
  logout(){
    this.fullSession(false);
      localStorage.removeItem('currentUser'),
      localStorage.removeItem('currentEmail'),
      localStorage.removeItem('currentFirstName'),
      localStorage.removeItem('currentLastName'),
      localStorage.removeItem('currentId'),
      localStorage.removeItem('currentPicture'),
      localStorage.removeItem('currentState'),
      localStorage.removeItem('currentRol'),
      localStorage.removeItem('currentRolId'),
      localStorage.removeItem('currentAvatar')
      localStorage.removeItem('currentClienteId')
      localStorage.removeItem('token')
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
}
