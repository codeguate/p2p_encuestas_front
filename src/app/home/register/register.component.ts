import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from 'angular2-notifications';
import { UsersService } from "../_services/users.service";
import { AuthService } from "../_services/auth.service";
declare let $: any
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selected:boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  title:any = "Registro"
  Table:any
  comboParent:any
  enviarData=false
  DPI:string = ""
  numeroTelefono:string = ""
  @BlockUI() blockUI: NgBlockUI;
  selectedData:any
  today:any
  nacimientoToday:any
  public rowsOnPage = 5;
  public search:any
  constructor(
      private _service: NotificationsService,
      private router: Router,
      private AuthService: AuthService,
      private mainService: UsersService,
    ) { }

  ngOnInit() {

    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear()-21;
    this.today = yyyy + '-' + mm + '-' + dd;
    this.nacimientoToday = yyyy + '-' + mm + '-' + dd;
  }

  select(dat:boolean){
    this.selected = dat;
  }

  cargarAll(){
    this.blockUI.start();
    this.mainService.getAll()
                      .then(response => {
                        this.Table = response

                        this.blockUI.stop();
                        console.clear
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
  }

  cargarSingle(id:number){
    this.blockUI.start();
    this.mainService.getSingle(id)
                      .then(response => {
                        this.selectedData = response;
                        console.clear

                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
  }
  update(formValue:any){
    this.blockUI.start();
    //console.log(data)
    this.mainService.update(formValue)
                      .then(response => {
                        $("#editModal .close").click();
                        this.cargarAll()
                        this.createSuccess('Tipo de Equipos Actualizado exitosamente')
                        console.clear

                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })

  }

  insert(formValue:any){

    this.blockUI.start();
    formValue.telefono2=formValue.telefono
    formValue.telefono=formValue.telefono.substring(1,formValue.telefono.length).replace(/ /g, '').replace(/-/g, '')
    formValue.password =  formValue.email.split('@')[0]
    formValue.username =  formValue.email.split('@')[0]
    let string = formValue.dpi+formValue.telefono+":"+formValue.username;
    let encodedString = btoa(string);
    formValue.codigo =  encodedString.substr(encodedString.length-20,encodedString.length);
    // console.log(formValue);

    this.mainService.create(formValue)
                      .then(async response => {
                        // console.log(response);
                        // this.cargarAll()
                        $("#generalModalDetalle").modal('hide');
                        this.blockUI.stop();
                        this.DPI = ''
                        this.numeroTelefono=''
                        $("#nombres").val('')
                        $("#apellidos").val('')
                        $("#email").val('')
                        this.enviarData=false;
                        this.createSuccess('Su solicitud se envio con exito')
                        // location.reload();
                        console.clear

                      }).catch(error => {
                        console.clear
                        // console.log(error);

                        this.blockUI.stop();
                        this.createError(error)
                      })


  }
  delete(id:string){
    this.blockUI.start();
    if(confirm("¿Desea eliminar el Tipo de Equipos?")){
    this.mainService.delete(id)
                      .then(response => {
                        this.cargarAll()
                        this.createSuccess('Tipo de Equipos Eliminado exitosamente')
                        console.clear

                        this.blockUI.stop();
                      }).catch(error => {
                        console.clear

                        this.blockUI.stop();
                        this.createError(error)
                      })
    }else{
                        console.clear

                        this.blockUI.stop();
    }

  }

  calidarTele(event){
    this.enviarData=false;
    let tel
    if(this.numeroTelefono.length>5){
      tel=this.numeroTelefono.substring(4,this.numeroTelefono.length).replace(/ /g, '').replace(/-/g, '')

    }else{
      tel=this.numeroTelefono.replace(/ /g, '').replace(/-/g, '')
    }
    if((event.keyCode)==8)        //"Enter" Key (13)
      {
        tel=tel.substring(0,tel.length);
        event.stopPropagation();
        return false;
      }
    this.numeroTelefono = this.formatearTel(tel);
  }

  cuiIsValid(event) {


    this.enviarData=false;
    // console.log(this.DPI.length)
      let cui=this.DPI.replace(/ /g, '').replace(/-/g, '')
      if((event.keyCode)==8)        //"Enter" Key (13)
      {
        cui=cui.substring(0,cui.length);
        event.stopPropagation();
        return false;
      }
      if (!cui) {
          // console.log("CUI vacío");
          this.DPI = this.formatearDPI(cui);

          return true;
      }

      let cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;

      if (!cuiRegExp.test(cui)) {
          $("#dpi").addClass('border border-danger')
          // console.log("CUI con formato inválido");
          this.DPI = this.formatearDPI(cui);
          return false;
      }

      cui = cui.replace(/\s/, '');
      let depto = parseInt(cui.substring(9, 11), 10);
      let muni = parseInt(cui.substring(11, 13));
      let numero:any = Array.from(cui.substring(0, 8));
      let verificador = parseInt(cui.substring(8, 9));

      // Se asume que la codificación de Municipios y
      // departamentos es la misma que esta publicada en
      // http://goo.gl/EsxN1a

      // Listado de municipios actualizado segun:
      // http://goo.gl/QLNglm

      // Este listado contiene la cantidad de municipios
      // existentes en cada departamento para poder
      // determinar el código máximo aceptado por cada
      // uno de los departamentos.
      let munisPorDepto = [
          /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
          /* 02 - El Progreso tiene:    */  8 /* municipios. */,
          /* 03 - Sacatepéquez tiene:   */ 16 /* municipios. */,
          /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
          /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
          /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
          /* 07 - Sololá tiene:         */ 19 /* municipios. */,
          /* 08 - Totonicapán tiene:    */  8 /* municipios. */,
          /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
          /* 10 - Suchitepéquez tiene:  */ 21 /* municipios. */,
          /* 11 - Retalhuleu tiene:     */  9 /* municipios. */,
          /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
          /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
          /* 14 - Quiché tiene:         */ 21 /* municipios. */,
          /* 15 - Baja Verapaz tiene:   */  8 /* municipios. */,
          /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
          /* 17 - Petén tiene:          */ 14 /* municipios. */,
          /* 18 - Izabal tiene:         */  5 /* municipios. */,
          /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
          /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
          /* 21 - Jalapa tiene:         */  7 /* municipios. */,
          /* 22 - Jutiapa tiene:        */ 17 /* municipios. */
      ];

      if (depto === 0 || muni === 0)
      {
          // console.log("CUI con código de municipio o departamento inválido.");
          this.DPI = this.formatearDPI(cui);
          return false;
      }

      if (depto > munisPorDepto.length)
      {
          // console.log("CUI con código de departamento inválido.");
          this.DPI = this.formatearDPI(cui);
          return false;
      }

      if (muni > munisPorDepto[depto -1])
      {
          // console.log("CUI con código de municipio inválido.");
          this.DPI = this.formatearDPI(cui);
          return false;
      }

      // Se verifica el correlativo con base
      // en el algoritmo del complemento 11.
      let total = 0;

      for (let i = 0; i < numero.length; i++)
      {
          total += numero[i] * (i + 2);
      }

      let modulo = (total % 11);
      this.DPI = this.formatearDPI(cui);
      // console.log("CUI con módulo: " + modulo);
      $("#dpi").removeClass('border border-danger')
      $("#dpi").addClass('border border-success')
      this.enviarData=true;

      return modulo === verificador;
  }
  formatearDPI(dpi){
    let numero:any = Array.from(dpi);
    let result = "";
    numero.forEach((element,i) => {
      result+=element
      if(i==3){
        result+=" - ";
      }

      if(i==8){
        result+=" - ";
      }

    });
    if(dpi.length>13){
      result = result.substring(0,result.length-1)
      this.enviarData=true;
      $("#dpi").removeClass('border border-danger')
      $("#dpi").addClass('border border-success')
    }else{
      this.enviarData=false;

      $("#dpi").addClass('border border-danger')


    }
    return result;
  }
  formatearTel(tel){
    let numero:any = Array.from(tel);
    let result = "+502 ";
    numero.forEach((element,i) => {
      result+=element
      if(i==3){
        result+=" - ";
      }

    });

    if(tel.length>=8){
      result = result.substring(0,16)
      this.enviarData=true;
      $("#telefono").removeClass('border border-danger')
      $("#telefono").addClass('border border-success')
    }else{
      this.enviarData=false;

      $("#telefono").addClass('border border-danger')


    }
    return result;
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
