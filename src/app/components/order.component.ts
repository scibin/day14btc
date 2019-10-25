import { Component, OnInit } from '@angular/core';
import { BtcsvcService, ORDER } from '../services/btcsvc.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  // Labels in the form
  cryptoPair = 'SGD/BTC';
  // First value is ask, second value is bid (backup values)
  askbidValue = [11475.32, 11465.36];

  // Initiate total ask and bid prices variables
  totalBid = 0;
  totalAsk = 0;

  // Other variables required for showing in form
  orderUnit = +0;
  buysell: string;
  totalPrice = 0;
  btcAsk: number;
  btcBid: number;

  // For the requirement that users must be at least 21 years old
  // maxDate is the latest date that the user can enter
  maxDate = moment().subtract(21, 'years');

  // For the requirement that the order placed must be from today onwards
  minDate = moment();

  calculatePrice(z) {
    // Calculates the total ask/bid price to 2 decimal places
    this.totalAsk = parseFloat((+z.value * this.askbidValue[0]).toFixed(2));
    this.totalBid = parseFloat((+z.value * this.askbidValue[1]).toFixed(2));
  }

  // QR code link
  // https://www.patrick-wied.at/static/qrgen/qrgen.php?r=14&a=0&content=buy%20bitcoin

  constructor(private btcsvc: BtcsvcService, private router: Router) { }

  ngOnInit() {
    this.btcsvc.apiCall()
    .then((i) => {
      this.askbidValue = i;
    });
    this.askbidValue.forEach((element) => Number(element.toFixed(2)));
  }

  submitForm(event: any) {
    const temp: ORDER = event.value;
    
    // Randomly generate an orderID
    temp.orderID = Math.floor(Math.random() * 1000000) + 3000000;
    
    // Sends order data to btcsvc service for storage
    this.btcsvc.setOrder(temp);
    
    // Sends total amount to btcsvc service for storage
    this.btcsvc.setTotalAmount([this.totalAsk, this.totalBid]);
    this.router.navigate(['/success'], { state: { id: temp.orderID } });
  }
}
