import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "./../_services/auth.service";
import { BlockUI,NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
declare var $: any

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
  data = {
    password:'',
    username:'',
    id:'0',
    type:'recovery'
  }
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mainService: AuthService,
    private _service: NotificationsService
  ) { }

  ngOnInit() {
    $('#searchContent').addClass('d-none');
    $('#inSeachForm').removeClass('d-none');
    $('#logoTipo').addClass('d-none');
    this.data.password=this.generatePasswordRand(20);

  }

  recovery(){
    this.data.password=this.generatePasswordRand(20);
    // console.log(this.data);
    this.blockUI.start()
    this.mainService.recovery(this.data)
                    .then( response => {
                      // console.log(response);
                      this.createSuccess("Hemos enviado un correo con tu nueva clave!")
                      this.data.username = '';
                      this.data.password = '';
                      this.blockUI.stop()
                    })
                    .catch( error => {
                      this.createError(error)
                      this.blockUI.stop()
                    })
  }

  generatePasswordRand(length:number,type?:string) {
   let characters = ''
   if(type) {
    switch(type){
        case 'num':
            characters = "0123456789";
            break;
        case 'alf':
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case 'rand':
            //FOR ↓
            break;
        default:
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }
   }else{
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   }

    var pass = "";
    for (let i=0; i < length; i++){
        if(type == 'rand'){
            pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
        }else{
            pass += characters.charAt(Math.floor(Math.random()*characters.length));
        }
    }
    return pass;
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
