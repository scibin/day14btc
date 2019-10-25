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

  // Initialize variables for current date and time (for logging the time when order request was submitted)
  // This is not date/time of order executed --> it may be different
  timeOfOrderRecv: string;
  dateOfOrderRecv: string;

  // Need to assign this to make stuff happen in html
  orderType: string;
  // Changed from number to string
  orderID: string;
  routedID: string;

  constructor(private btcsvc: BtcsvcService, private router: Router) {
    // Able to pass the ID to confirmation page so that we can use the ID to retrieve data from server
    // https://stackoverflow.com/questions/44864303/send-data-through-routing-paths-in-angular
    this.routedID = this.router.getCurrentNavigation().extras.state.id;
  }

  ngOnInit() {
    this.btcsvc.getOrderDetail(this.routedID)
    .then((result) => {
      this.orderInfo = result;
      // Converting epoch time to moment
      // .format('MMMM Do YYYY')
      this.orderInfo.dateOfBirth = this.btcsvc.converEpochToMoment(this.orderInfo.dateOfBirth).format('MMMM Do YYYY');
      this.orderInfo.dateOfOrder = this.btcsvc.converEpochToMoment(this.orderInfo.dateOfOrder).format('MMMM Do YYYY');
    })
    // console.info('This is orderInfo', this.orderInfo);
    this.totalAmount = this.btcsvc.getTotalAmount();
    // Date and time of order submitted by customer (not date/time of order executed!)
    this.timeOfOrderRecv = moment().format('h:mm:ss a');
    this.dateOfOrderRecv = moment().format('MMMM Do YYYY');
  }

  back() {
    this.router.navigate(['/']);
  }

  // convertMoment(date: moment.Moment) {
  //   return date.format('MMMM Do YYYY');
  // }
}
