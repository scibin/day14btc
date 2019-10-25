import { Component, OnInit } from '@angular/core';
import { BtcsvcService, ORDER } from '../services/btcsvc.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.css']
})
export class OrderdetailComponent implements OnInit {

  constructor(private btcsvc: BtcsvcService, private router: Router,
              private activatedRoute: ActivatedRoute) { }

  orderID: string;
  orderSingleData: any;

  editForm: FormGroup;

  ngOnInit() {
    this.orderID = this.activatedRoute.snapshot.params.id;
    console.log(this.orderID);
    this.btcsvc.getOrderDetail(this.orderID)
    .then((result) => {
      this.orderSingleData = result;
      console.log(this.orderSingleData);
      // Change date format
      this.orderSingleData.dateOfBirth = this.btcsvc.converEpochToMoment(this.orderSingleData.dateOfBirth);
      this.orderSingleData.dateOfOrder = this.btcsvc.converEpochToMoment(this.orderSingleData.dateOfOrder);
      // For reactive form, populate the values
      this.editForm.patchValue({
        'btcAddress': this.orderSingleData.btcAddress,
        'contactNumber': this.orderSingleData.contactNumber,
        'dateOfBirth': this.orderSingleData.dateOfBirth,
        'dateOfOrder': this.orderSingleData.dateOfOrder,
        'gender': this.orderSingleData.gender,
        'name': this.orderSingleData.name,
        'orderType': this.orderSingleData.orderType,
        'orderUnit': this.orderSingleData.orderUnit,
        'paylahCode': this.orderSingleData.paylahCode,
        'orderID': this.orderSingleData.orderID   
        })
    });

    // For reactive form
    this.editForm = new FormGroup({
      'btcAddress': new FormControl(null, Validators.required),
      'contactNumber': new FormControl(null, Validators.required),
      'dateOfBirth': new FormControl(null, Validators.required),
      'dateOfOrder': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'name': new FormControl(null, Validators.required),
      'orderType': new FormControl(null, Validators.required),
      'orderUnit': new FormControl(null, Validators.required),
      'paylahCode': new FormControl(null, Validators.required),
      'orderID': new FormControl(null, Validators.required)
    });
  }

  // For reactive form
  onSubmit() {
    console.log(this.editForm);
    const updatedData = this.editForm.value;
    this.btcsvc.updateOrder(updatedData);
    this.router.navigate(['/success'], { state: { id: updatedData.orderID } });
  }

  back() {
    this.router.navigate(['/']);
  }

}
