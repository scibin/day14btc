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
  private orderInfoSS: ORDER;
  private orderInfoSSAll: ORDER[];

  // totalAmount: [ask, bid]
  private totalAmount: number[];

  // GET parameters
  private coin = 'BTC';
  private currencyPair = 'SGD';

  constructor(private http: HttpClient) { }

  // Hardcoded URLs
  addURL = 'http://localhost:3001/setinfo';
  getURL = 'http://localhost:3001/getallinfo';
  getSingleURL = 'http://localhost:3001/getsingleinfo';
  updateSingleURL = 'http://localhost:3001/updatesingleinfo';

  // Function takes in a moment.Moment object and returns a number (epoch time)
  convertMomentToEpoch = (momIn: moment.Moment) => momIn.unix(); 

  // Function takes in a number (epoch time) and returns a moment.Moment object
  converEpochToMoment = (epochIn: number) => moment.unix(epochIn); 

  setOrder(input: ORDER) {
    // Intercepting dates and changing them to epoch time (type number)
    input.dateOfBirth = this.convertMomentToEpoch(input.dateOfBirth);
    input.dateOfOrder = this.convertMomentToEpoch(input.dateOfOrder);

    // this.orderInfo.push(input);
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

  getListOfOrders() {
    // http get method --> get data from server
    const headers = new HttpHeaders().set('Content-Type', 'app-json');
    return(
      this.http.get<any>(this.getURL, {headers})
    .toPromise()
    .then((result) => {
      this.orderInfoSSAll = JSON.parse(result);
      // console.info('This is type of orderInfoSS: ', typeof this.orderInfoSS);
      // console.info('This is length of orderInfoSS: ', this.orderInfoSS.length);
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
    // this.orderInfo.push(input);
    // console.info('This is orderInfo array now: ', this.orderInfo);

    // http put method
    const formData = new FormData();
    // Append all values in input/order
    Object.entries(input).forEach((value) => {
      // Catches any undefined values and set them to '0'
      if (value[1] === undefined) {
        formData.append(value[0], '0');
      } else {
        formData.append(value[0], value[1].toString());
      }
      // Removed the .toString() portion
      // formData.append(value[0], value[1].toString());
    });
    this.http.put<any>(this.updateSingleURL, formData, { params: paramsToServer })
    .toPromise()
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
