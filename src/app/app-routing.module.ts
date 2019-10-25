import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './components/order.component';
import { ConfirmationComponent } from './components/confirmation.component';
import { ListComponent } from './components/list.component';
import { OrderdetailComponent } from './components/orderdetail.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'success', component: ConfirmationComponent },
  { path: 'list', component: ListComponent },
  { path: 'list/:id', component: OrderdetailComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
