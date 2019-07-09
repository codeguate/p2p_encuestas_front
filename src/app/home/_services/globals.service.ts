import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {
      private ResultsData = new BehaviorSubject([]);
      private searchData = new BehaviorSubject([]);

      constructor() { }

      getResults(): Observable<any> {
        return this.ResultsData.asObservable();
      }

      getSearch(): Observable<any> {
        return this.searchData.asObservable();
      }

      changeResults(data: any) {
        this.ResultsData.next(data);
      }

      changeSearch(data: any) {
        this.searchData.next(data);
      }

      loadDummyData() {
        let dato:any = {
          searchContent: '',
          type: 'All'
        }
        this.searchData.next(dato);
      }


    }
