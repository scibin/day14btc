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

  orderInfo: ORDER;
  custodianBTCaddress = '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo';
  totalAmount: number[];

  // Initialize variables for date formatting
  dobFormat: string;
  dooFormat: string;
  timeOfOrder: string;

  // Need to assign this to make stuff happen in html
  orderType: string;
  orderID: number;

  constructor(private btcsvc: BtcsvcService, private router: Router) { }

  ngOnInit() {
    this.orderInfo = this.btcsvc.getOrder();
    this.totalAmount = this.btcsvc.getTotalAmount();
    this.dobFormat = this.convertMoment(this.orderInfo.dateOfBirth);
    this.dooFormat = this.convertMoment(this.orderInfo.dateOfOrder);
    this.timeOfOrder = moment().format('h:mm:ss a');
    this.orderID = Math.floor(Math.random() * 100000) + 300000;
  }

  back() {
    this.router.navigate(['/']);
  }

  convertMoment(date: moment.Moment) {
    return date.format('MMMM Do YYYY');
  }
}
