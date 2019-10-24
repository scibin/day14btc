import { Component, OnInit } from '@angular/core';
import { BtcsvcService, ORDER } from '../services/btcsvc.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  orderInfo: ORDER = {
  // orderInfo: any = {
    btcAddress: '1',
    contactNumber: '1',
    dateOfBirth: moment(),
    dateOfOrder: moment(),
    gender: 'male',
    name: '1',
    orderType: 'buy',
    orderUnit: 0,
    paylahCode: '1'};

  custodianBTCaddress = '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo';
  totalAmount: number[];

  // Initialize variables for date formatting
  dobFormat: string;
  dooFormat: string;
  timeOfOrder: string;

  // Need to assign this to make stuff happen in html
  orderType: string;
  // Changed from number to string
  orderID: string;

  constructor(private btcsvc: BtcsvcService, private router: Router) { }

  ngOnInit() {
    this.btcsvc.getOrder()
    .then((result) => {
      this.orderInfo = result;
    })
    console.info('This is orderInfo', this.orderInfo);
    this.totalAmount = this.btcsvc.getTotalAmount();
    // this.dobFormat = this.convertMoment(this.orderInfo.dateOfBirth);
    // this.dooFormat = this.convertMoment(this.orderInfo.dateOfOrder);
    this.timeOfOrder = moment().format('h:mm:ss a');
    this.orderID = this.orderInfo.orderID;
  }

  back() {
    this.router.navigate(['/']);
  }

  // convertMoment(date: moment.Moment) {
  //   return date.format('MMMM Do YYYY');
  // }
}
