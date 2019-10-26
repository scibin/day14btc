import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ORDER {
  btcAddress?: string;
  contactNumber: string;
  // changed from moment.Moment to any
  dateOfBirth: any;
  dateOfOrder: any;
  gender: string;
  name: string;
  orderType: string;
  // all numbers changed from type number to any
  orderUnit: any;
  paylahCode?: string;
  orderID?: any;
}

@Injectable({
  providedIn: 'root'
})

export class BtcsvcService {

  // private orderInfo: ORDER = {
  //   btcAddress: '',
  //   contactNumber: '',
  //   dateOfBirth: moment(),
  //   dateOfOrder: moment(),
  //   gender: '',
  //   name: '',
  //   orderType: '',
  //   orderUnit: 0,
  //   paylahCode: ''};

  // Order data stored locally
  // private orderInfo: ORDER[] = [];

  // Order data from server side
  private orderInfoSS: ORDER;
  private orderInfoSSAll: ORDER[];

  // totalAmount: [ask, bid]
  private totalAmount: number[];

  // GET parameters
  private coin = 'BTC';
  private currencyPair = 'SGD';

  constructor(private http: HttpClient) { }

  // Hardcoded URLs
  baseURL = environment.api_url || 'http://localhost:3001';
  addURL = `${this.baseURL}/setinfo`;
  getURL = `${this.baseURL}/getallinfo`;
  getSingleURL = `${this.baseURL}/getsingleinfo`;
  updateSingleURL = `${this.baseURL}/updatesingleinfo`;
  getPriceURL = `${this.baseURL}/price`;

  // Function takes in a moment.Moment object and returns a number (epoch time)
  convertMomentToEpoch = (momIn: moment.Moment) => momIn.unix(); 

  // Function takes in a number (epoch time) and returns a moment.Moment object
  converEpochToMoment = (epochIn: number) => moment.unix(epochIn); 

  setOrder(input: ORDER) {
    // Intercepting dates and changing them to epoch time (type number)
    input.dateOfBirth = this.convertMomentToEpoch(input.dateOfBirth);
    input.dateOfOrder = this.convertMomentToEpoch(input.dateOfOrder);

    // http post method
    const formData = new FormData();
    // Append all values in input/order
    Object.entries(input).forEach((value) => {
      formData.append(value[0], value[1].toString());
    });
    this.http.post<any>(this.addURL, formData).subscribe(
      (res) => console.log('Data has been sent from Angular end'),
      (err) => console.log(err)
    );
  }

  getListOfOrders() {
    // http get method --> get data from server
    const headers = new HttpHeaders().set('Content-Type', 'app-json');
    return(
      this.http.get<any>(this.getURL, {headers})
    .toPromise()
    .then((result) => {
      this.orderInfoSSAll = JSON.parse(result);
      return this.orderInfoSSAll;
    })
    );
  }

  getOrderDetail(servedID: string) {
    // http get method --> get data from server
    const paramsToServer = new HttpParams()
    .set('id', servedID);
    const headersToServer = new HttpHeaders().set('Content-Type', 'app-json');
    return(
      this.http.get<any>(this.getSingleURL, {params: paramsToServer, headers: headersToServer})
    .toPromise()
    .then((result) => {
      this.orderInfoSS = JSON.parse(result);
      // Converting epoch time to moment
      this.orderInfoSS.dateOfBirth = this.converEpochToMoment(this.orderInfoSS.dateOfBirth);
      this.orderInfoSS.dateOfOrder = this.converEpochToMoment(this.orderInfoSS.dateOfOrder);
      // const orderMatched = this.orderInfoSS.find((value) => value.orderID === servedID)
      // console.info('This is type of orderInfoSS: ', typeof this.orderInfoSS);
      // console.info('This is length of orderInfoSS: ', this.orderInfoSS.length);
      return this.orderInfoSS;
    })
    );
  }

  updateOrder(input: ORDER) {
    // Converts the moment date to epoch time
    input.dateOfBirth = this.convertMomentToEpoch(input.dateOfBirth);
    input.dateOfOrder = this.convertMomentToEpoch(input.dateOfOrder);
    
    const paramsToServer = new HttpParams()
    .set('id', input.orderID);

    // http put method
    const formData = new FormData();
    // Append all values in input/order
    Object.entries(input).forEach((value) => {
      // Catches any undefined values, since toString method won't work
      if (value[1] === undefined) {
        formData.append(value[0], '');
      } else {
        formData.append(value[0], value[1].toString());
      }
    });
    this.http.put<any>(this.updateSingleURL, formData, { params: paramsToServer })
    .toPromise()
  }

  getPrice(): Promise<any> {
    return(
      this.http.get<any>(`${this.getPriceURL}?crypto=${this.coin}&fiat=${this.currencyPair}`)
      .pipe(
        map((v: any) => {
          return ([v[`${this.coin}${this.currencyPair}`].ask, v[`${this.coin}${this.currencyPair}`].bid]);
        })
      )
      .toPromise()
    );
  }

  setTotalAmount(value) {
    this.totalAmount = value;
  }

  // Get bitcoin price from backend 
  getTotalAmount() {
    return this.totalAmount;
  }

  // apiCall(): Promise<any> {
  //   const params = new HttpParams()
  //   .set('crypto', this.coin)
  //   .set('fiat', this.currencyPair);
  //   const headers = new HttpHeaders()
  //   .set('Content-Type', 'app-json')
  //   .set('X-testing', 'testing');
  //   return (
  //     this.http.get('https://cors-anywhere.herokuapp.com/apiv2.bitcoinaverage.com/indices/global/ticker/all', {params, headers})
  //     .pipe(
  //       map((v: any) => {
  //         return ([v.BTCSGD.ask, v.BTCSGD.bid]);
  //       })
  //     )
  //     .toPromise()
  //   );
  // }
}
