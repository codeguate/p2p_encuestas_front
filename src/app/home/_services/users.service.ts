import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { path } from "../../config.module";

// import "rxjs/add/operator/toPromise";

@Injectable({
providedIn: 'root',
})
export class UsersService {
	headers = new HttpHeaders({
    'Content-Type' : 'application/json'})
private basePath:string = path.path

private token = '';

constructor(private http:HttpClient){

  this.reloadToken();
}

    private handleError(error:any):Promise<any> {
      console.error("ha ocurrido un error")
      console.log(error)
      return Promise.reject(error.message || error)
    }

    reloadToken(token?){
      let datos = token?token:localStorage.getItem('token');
      if(datos){
        this.token = (datos);
      }else{
        this.token = path.token
      }
      this.headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token});
    }
    getAll():Promise<any> {
      this.reloadToken()
      let url = `${this.basePath}/api/users`
      return this.http.get(url)
                      .toPromise()
                        .then(response => {
                          //console.log(response;)
                          return response;
                        })
                        .catch(this.handleError)
    }


    create(form):Promise<any> {
    let url = `${this.basePath}/api/users`
      return this.http.post(url,form)
                      .toPromise()
                        .then(response => {
                          // console.log(response)
                          return response;
                        })
                        .catch(error => {
                          console.log(error);

                        })
    }




    addAddress(form):Promise<any> {
      this.reloadToken()
      let url = `${this.basePath}/api/direcciones`
      return this.http.post(url,form)
                      .toPromise()
                        .then(response => {
                          // console.log(response)
                          return response;
                        })
                        .catch(this.handleError)
    }

    delete(id):Promise<any> {
    let url = `${this.basePath}/api/users/${id}`
      return this.http.delete(url)
                      .toPromise()
                        .then(response => {
                          //console.log(response;)
                          return response;
                        })
                        .catch(this.handleError)
    }

    update(form):Promise<any> {
      this.reloadToken()
      let url = `${this.basePath}/api/users/${form.id}`
      return this.http.put(url,form,{headers: this.headers})
                      .toPromise()
                        .then(response => {
                          //console.log(response;)
                          return response;
                        })
                        .catch(this.handleError)
    }

    getSingle(id:number):Promise<any> {
      this.reloadToken()
      let url = `${this.basePath}/api/users/${id}`
    // console.log(this.headers);

      return this.http.get(url,{headers: this.headers})
                      .toPromise()
                        .then(response => {
                          //console.log(response;)
                          return response;
                        })
                        .catch(this.handleError)
    }
}
