import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './components/order.component';
import { ConfirmationComponent } from './components/confirmation.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'success', component: ConfirmationComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
