import { Component, OnInit } from '@angular/core';
import { BtcsvcService, ORDER } from '../services/btcsvc.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private btcsvc: BtcsvcService, private router: Router) { }

  orderList: ORDER[] = [];

  ngOnInit() {
    this.btcsvc.getListOfOrders()
    .then((result) => {
      this.orderList = result;
    })
  }

  back() {
    this.router.navigate(['/']);
  }

}
