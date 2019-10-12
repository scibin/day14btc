import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';

export interface ORDER {
  btcAddress?: string;
  contactNumber: string;
  dateOfBirth: moment.Moment;
  dateOfOrder: moment.Moment;
  gender: string;
  name: string;
  orderType: string;
  orderUnit: number;
  paylahCode?: string;
}

@Injectable({
  providedIn: 'root'
})

export class BtcsvcService {

  private orderInfo: ORDER = {
    btcAddress: '',
    contactNumber: '',
    dateOfBirth: moment(),
    dateOfOrder: moment(),
    gender: '',
    name: '',
    orderType: '',
    orderUnit: 0,
    paylahCode: ''};
  // totalAmount: [ask, bid]
  private totalAmount: number[];

  // GET parameters
  private coin = 'BTC';
  private currencyPair = 'SGD';

  constructor(private http: HttpClient) { }

  setOrder(input: ORDER) {
    this.orderInfo = input;
  }

  getOrder() {
    return this.orderInfo;
  }

  setTotalAmount(value) {
    this.totalAmount = value;
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  apiCall(): Promise<any> {
    const params = new HttpParams()
    .set('crypto', this.coin)
    .set('fiat', this.currencyPair);
    const headers = new HttpHeaders()
    .set('Content-Type', 'app-json')
    .set('X-testing', 'testing');
    return (
      this.http.get('https://cors-anywhere.herokuapp.com/apiv2.bitcoinaverage.com/indices/global/ticker/all', {params, headers})
      .pipe(
        map((v: any) => {
          return ([v.BTCSGD.ask, v.BTCSGD.bid]);
        })
      )
      .toPromise()
    );
  }
}
