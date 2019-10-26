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
    this.btcsvc.getOrderDetail(this.orderID)
    .then((result) => {
      this.orderSingleData = result;
      // For reactive form, populate the values using patchValue
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
      // If it is buy, btcAddress is a required field. If it is sell, paylahCode is a required field
      // if (this.editForm.get('orderType').value === 'buy') {
      //   this.editForm.get('btcAddress').setValidators(Validators.required);
      // } else {
      //   this.editForm.get('paylahCode').setValidators(Validators.required);
      // }
    });

    // For reactive form
    this.editForm = new FormGroup({
      'btcAddress': new FormControl(null),
      'contactNumber': new FormControl(null, [Validators.required, Validators.pattern('(?=.*[0-9])[- +()0-9]+')]),
      'dateOfBirth': new FormControl(null, Validators.required),
      'dateOfOrder': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'name': new FormControl(null, Validators.required),
      'orderType': new FormControl(null, Validators.required),
      'orderUnit': new FormControl(null, Validators.required),
      'paylahCode': new FormControl(null),
      'orderID': new FormControl(null, Validators.required)
    });
  }

  // Adds/removes validators of paylahCode and btcAddress depending on whether buy or sell is pressed
  // orderTypeToggler() {
  //   if (this.editForm.get('orderType').value === 'buy') {
  //     // btcAddress required paylahCode remove
  //     if (!this.editForm.get('btcAddress').validator) {this.editForm.get('btcAddress').setValidators(Validators.required)}
  //     if (this.editForm.get('paylahCode').validator) {this.editForm.get('paylahCode').clearValidators()}
  //   } else {
  //     // btcAddress remove paylahCode required
  //     if (this.editForm.get('btcAddress').validator) {this.editForm.get('btcAddress').clearValidators()}
  //     if (!this.editForm.get('paylahCode').validator) {this.editForm.get('paylahCode').setValidators(Validators.required)}
  //   }
  // }
  // Reactive form validator functions
  // forbiddenNumbers(control: FormControl): {[s: string]: Boolean} {
  //   if () {
  //     return;
  //   }
  //   return null;
  // }

  // For reactive form
  onSubmit() {
    const updatedData = this.editForm.value;
    this.btcsvc.updateOrder(updatedData);
    this.router.navigate(['/success'], { state: { id: updatedData.orderID } });
  }

  back() {
    this.router.navigate(['/']);
  }

}
