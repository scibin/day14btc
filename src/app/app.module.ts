import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderComponent } from './components/order.component';
import { ConfirmationComponent } from './components/confirmation.component';

// Manually added
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BtcsvcService } from './services/btcsvc.service';
// import { RouterModule } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListComponent } from './components/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Directive, TemplateRef } from '@angular/core';
import { OrderdetailComponent } from './components/orderdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    ConfirmationComponent,
    ListComponent,
    OrderdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    MatMomentDateModule,
    ReactiveFormsModule
  ],
  providers: [ BtcsvcService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
