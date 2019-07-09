import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export const LANG = 'es';

@Injectable({
  providedIn: 'root'
})
export class LangService {
      private langSubject = new BehaviorSubject('');
      private lang:string;

      constructor() { }

      getLang(): Observable<string> {
        return this.langSubject.asObservable();
      }

      private refresh() {
        // Emitir los nuevos valores para que todos los que dependan se actualicen.
        this.langSubject.next(this.lang);
      }

      changeLangs(lang: string) {
        /**
        * Evitar hacer this.user.push() pues estaríamos modificando los valores directamente,
        * se debe generar un nuevo array !!!!.
        */
        this.lang = lang;
        this.refresh();
      }

      loadData() {
        this.lang = LANG;
        this.refresh();
      }

    }
