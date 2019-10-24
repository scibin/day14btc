import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable } from 'rxjs';

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
  private orderInfo: ORDER[] = [];
  // Order data from server side
  private orderInfoSS: ORDER[] = [];

  // totalAmount: [ask, bid]
  private totalAmount: number[];

  // GET parameters
  private coin = 'BTC';
  private currencyPair = 'SGD';

  constructor(private http: HttpClient) { }

  // Hardcoded URLs
  addURL = 'http://localhost:3001/setinfo';
  getURL = 'http://localhost:3001/getinfo';

  setOrder(input: ORDER) {
    // Randomly generate an orderID
    input.orderID = Math.floor(Math.random() * 1000000) + 3000000;
    
    // Intercepting dates and changing them to string
    input.dateOfBirth = input.dateOfBirth.format('MMMM Do YYYY');
    input.dateOfOrder = input.dateOfOrder.format('MMMM Do YYYY');
    
    this.orderInfo.push(input);
    // console.info('This is orderInfo array now: ', this.orderInfo);
    
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

  getOrder() {
    // http get method --> get data from server
    const headers = new HttpHeaders().set('Content-Type', 'app-json');
    return(
      this.http.get<any>(this.getURL, {headers})
    .toPromise()
    .then((result) => {
      this.orderInfoSS = JSON.parse(result);
      console.info('This is orderInfoSS: ', this.orderInfoSS);
      console.info(this.orderInfoSS[this.orderInfoSS.length - 1]);
      // console.info('This is type of orderInfoSS: ', typeof this.orderInfoSS);
      // console.info('This is length of orderInfoSS: ', this.orderInfoSS.length);
      
      // !!! Returns latest order through last entry in array. Can probably be improved
      return this.orderInfoSS[this.orderInfoSS.length - 1];
    })
    );
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
